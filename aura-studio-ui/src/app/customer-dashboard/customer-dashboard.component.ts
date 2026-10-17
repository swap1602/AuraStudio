import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <!-- Welcome Header -->
      <div class="dashboard-header glass-card">
        <div class="user-info">
          <div class="user-avatar">{{ user?.fullName?.charAt(0) || 'C' }}</div>
          <div>
            <h2>Welcome back, <span class="gradient-text">{{ user?.fullName || 'Client' }}</span>!</h2>
            <p class="email-text">Email: {{ user?.email }} | Role: Customer</p>
          </div>
        </div>
        <a routerLink="/booking" class="btn-primary">
          <span>Book New Session</span>
          <span>⚡</span>
        </a>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid-3 metrics-grid">
        <div class="glass-card metric-card">
          <span class="metric-icon">📅</span>
          <div>
            <span class="metric-title">Active Reservations</span>
            <h3 class="metric-val gradient-text">{{ getActiveCount() }}</h3>
          </div>
        </div>

        <div class="glass-card metric-card">
          <span class="metric-icon">🎟️</span>
          <div>
            <span class="metric-title">Total Bookings</span>
            <h3 class="metric-val gradient-text">{{ bookings.length }}</h3>
          </div>
        </div>

        <div class="glass-card metric-card">
          <span class="metric-icon">💳</span>
          <div>
            <span class="metric-title">Total Investment</span>
            <h3 class="metric-val gradient-text">\${{ getTotalSpent() }}</h3>
          </div>
        </div>
      </div>

      <!-- Bookings Section -->
      <div class="glass-card main-table-card">
        <div class="table-header">
          <h3>Your Studio Reservations</h3>
          <span class="badge badge-cyan">{{ bookings.length }} Items</span>
        </div>

        <div *ngIf="bookings.length === 0" class="no-data text-center">
          <p>No active reservations found. Click below to schedule your first studio session!</p>
          <a routerLink="/booking" class="btn-primary mt-14">Book Studio Now</a>
        </div>

        <div *ngIf="bookings.length > 0" class="table-responsive">
          <table class="aura-table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Studio Suite</th>
                <th>Date & Time</th>
                <th>Add-ons</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bookings">
                <td class="ref-cell">#AUR-{{ b.id }}</td>
                <td>
                  <strong>{{ b.serviceName }}</strong>
                  <div class="room-sub">{{ b.studioRoom }}</div>
                </td>
                <td>
                  <div>{{ b.bookingDate }}</div>
                  <div class="time-sub">{{ b.timeSlot }} ({{ b.durationHours }}h)</div>
                </td>
                <td class="addons-cell">{{ b.addOns || 'Standard Studio' }}</td>
                <td class="price-cell">\${{ b.totalAmount }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-green': b.status === 'Confirmed' || b.status === 'Completed',
                    'badge-amber': b.status === 'Pending',
                    'badge-purple': b.status === 'Cancelled'
                  }">{{ b.status }}</span>
                </td>
                <td>
                  <button *ngIf="b.status === 'Confirmed'" (click)="cancelBooking(b.id!)" class="btn-danger">
                    Cancel
                  </button>
                  <a *ngIf="b.status === 'Completed' || b.status === 'Cancelled'" [routerLink]="['/booking']" [queryParams]="{service: b.serviceName}" class="btn-outline-glow btn-sm">
                    Re-book
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 36px;
      margin-bottom: 28px;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.5rem;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
    }
    .user-info h2 { font-size: 1.6rem; margin-bottom: 2px; }
    .email-text { color: var(--text-muted); font-size: 0.88rem; }

    .metrics-grid { margin-bottom: 32px; }
    .metric-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
    }
    .metric-icon {
      font-size: 2.2rem;
      background: rgba(255, 255, 255, 0.05);
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .metric-title { font-size: 0.85rem; color: var(--text-muted); }
    .metric-val { font-size: 1.8rem; font-weight: 800; margin-top: 2px; }

    .main-table-card { padding: 30px; }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 16px;
    }
    .table-responsive { overflow-x: auto; }
    
    .aura-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .aura-table th {
      padding: 12px 16px;
      font-size: 0.82rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--border-glass);
    }
    .aura-table td {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.9rem;
    }
    .ref-cell { font-family: monospace; font-weight: bold; color: var(--primary-glow); }
    .room-sub, .time-sub { font-size: 0.78rem; color: var(--text-muted); }
    .addons-cell { max-width: 200px; color: var(--text-muted); font-size: 0.82rem; }
    .price-cell { font-weight: bold; color: #ffffff; }

    .no-data { padding: 40px 0; color: var(--text-muted); }
    .mt-14 { margin-top: 14px; }
    .btn-sm { padding: 6px 14px; font-size: 0.8rem; }
    .text-center { text-align: center; }

    @media (max-width: 768px) {
      .dashboard-header { flex-direction: column; gap: 20px; text-align: center; }
      .user-info { flex-direction: column; }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  user: User | null = null;
  bookings: Booking[] = [];

  constructor(private authService: AuthService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    const userId = this.user?.id || 2;

    this.bookingService.getUserBookings(userId).subscribe(data => {
      this.bookings = data;
    });
  }

  getActiveCount(): number {
    return this.bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  }

  getTotalSpent(): number {
    return this.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  }

  cancelBooking(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe(() => {
        const found = this.bookings.find(b => b.id === id);
        if (found) found.status = 'Cancelled';
      });
    }
  }
}
