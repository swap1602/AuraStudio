import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../services/booking.service';
import { PaymentService } from '../services/payment.service';
import { Booking } from '../models/booking.model';
import { PaymentRecord } from '../models/payment.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container section">
      <div class="admin-header glass-card">
        <div>
          <span class="badge badge-purple">Executive Control Panel</span>
          <h2>AuraStudio <span class="gradient-text">Admin Command Center</span></h2>
          <p class="sub-title">Real-time studio occupancy, revenue analytics, and booking administration.</p>
        </div>
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span>System Operational</span>
        </div>
      </div>

      <!-- Financial & Studio Metrics -->
      <div class="grid-4 metric-cards">
        <div class="glass-card metric-card">
          <span class="metric-icon">💰</span>
          <div>
            <span class="metric-title">Gross Revenue</span>
            <h3 class="metric-val gradient-text">\${{ getTotalRevenue() }}</h3>
          </div>
        </div>

        <div class="glass-card metric-card">
          <span class="metric-icon">⚡</span>
          <div>
            <span class="metric-title">Active Bookings</span>
            <h3 class="metric-val gradient-text">{{ getActiveCount() }}</h3>
          </div>
        </div>

        <div class="glass-card metric-card">
          <span class="metric-icon">👥</span>
          <div>
            <span class="metric-title">Total Bookings</span>
            <h3 class="metric-val gradient-text">{{ allBookings.length }}</h3>
          </div>
        </div>

        <div class="glass-card metric-card">
          <span class="metric-icon">📈</span>
          <div>
            <span class="metric-title">Studio Utilization</span>
            <h3 class="metric-val gradient-text">92%</h3>
          </div>
        </div>
      </div>

      <!-- Studio Suite Utilization Bars -->
      <div class="glass-card utilization-card">
        <h3>Studio Suite Demand & Occupancy</h3>
        <div class="grid-3 util-grid">
          <div class="util-item">
            <div class="util-label">
              <span>Photography Suite Alpha</span>
              <strong>88%</strong>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width: 88%"></div></div>
          </div>
          <div class="util-item">
            <div class="util-label">
              <span>Dolby Atmos Music Studio</span>
              <strong>95%</strong>
            </div>
            <div class="progress-bar"><div class="progress-fill purple" style="width: 95%"></div></div>
          </div>
          <div class="util-item">
            <div class="util-label">
              <span>4K Podcast Lounge</span>
              <strong>91%</strong>
            </div>
            <div class="progress-bar"><div class="progress-fill cyan" style="width: 91%"></div></div>
          </div>
        </div>
      </div>

      <!-- Admin Bookings Management Table -->
      <div class="glass-card main-table-card">
        <div class="table-header">
          <h3>Manage All Client Reservations</h3>
          <div class="table-actions">
            <input type="text" class="form-control search-input" [(ngModel)]="searchTerm" placeholder="Search by customer, room, or ref..." />
          </div>
        </div>

        <div class="table-responsive">
          <table class="aura-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name & Email</th>
                <th>Studio Suite</th>
                <th>Date & Slot</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of filteredBookings()">
                <td class="ref-cell">#AUR-{{ b.id }}</td>
                <td>
                  <strong>{{ b.customerName }}</strong>
                  <div class="sub-text">{{ b.customerEmail }}</div>
                </td>
                <td>
                  <strong>{{ b.serviceName }}</strong>
                  <div class="sub-text">{{ b.studioRoom }}</div>
                </td>
                <td>
                  <div>{{ b.bookingDate }}</div>
                  <div class="sub-text">{{ b.timeSlot }}</div>
                </td>
                <td class="price-cell">\${{ b.totalAmount }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-green': b.status === 'Confirmed' || b.status === 'Completed',
                    'badge-amber': b.status === 'Pending',
                    'badge-purple': b.status === 'Cancelled'
                  }">{{ b.status }}</span>
                </td>
                <td>
                  <div class="status-buttons">
                    <button *ngIf="b.status !== 'Completed'" (click)="updateStatus(b.id!, 'Completed')" class="btn-sm btn-green">
                      Complete
                    </button>
                    <button *ngIf="b.status !== 'Cancelled'" (click)="updateStatus(b.id!, 'Cancelled')" class="btn-sm btn-danger">
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 36px;
      margin-bottom: 28px;
    }
    .admin-header h2 { font-size: 1.8rem; margin: 6px 0; }
    .sub-title { color: var(--text-muted); font-size: 0.9rem; }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      padding: 8px 16px;
      border-radius: 20px;
      color: var(--neon-green);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--neon-green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--neon-green);
    }

    .metric-cards { margin-bottom: 28px; }
    .metric-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }
    .metric-icon {
      font-size: 2rem;
      background: rgba(255, 255, 255, 0.05);
      width: 50px;
      height: 50px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .metric-title { font-size: 0.82rem; color: var(--text-muted); }
    .metric-val { font-size: 1.6rem; font-weight: 800; }

    .utilization-card {
      margin-bottom: 28px;
      padding: 24px 30px;
    }
    .utilization-card h3 {
      font-size: 1.15rem;
      margin-bottom: 20px;
    }
    .util-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .util-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00f2fe, #4facfe);
      border-radius: 4px;
    }
    .progress-fill.purple { background: linear-gradient(90deg, #7f00ff, #e100ff); }
    .progress-fill.cyan { background: linear-gradient(90deg, #00ff88, #00f2fe); }

    .main-table-card { padding: 30px; }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .search-input { width: 280px; padding: 8px 14px; font-size: 0.88rem; }

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
      border-bottom: 1px solid var(--border-glass);
    }
    .aura-table td {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.9rem;
    }
    .ref-cell { font-family: monospace; font-weight: bold; color: var(--primary-glow); }
    .sub-text { font-size: 0.78rem; color: var(--text-muted); }
    .price-cell { font-weight: bold; color: #fff; }

    .status-buttons { display: flex; gap: 8px; }
    .btn-sm { padding: 4px 10px; font-size: 0.78rem; border-radius: 4px; cursor: pointer; border: none; font-weight: 600; }
    .btn-green { background: rgba(0, 255, 136, 0.15); color: var(--neon-green); border: 1px solid rgba(0, 255, 136, 0.3); }
    .btn-green:hover { background: rgba(0, 255, 136, 0.3); }

    @media (max-width: 768px) {
      .admin-header { flex-direction: column; gap: 16px; text-align: center; }
      .table-header { flex-direction: column; gap: 14px; }
      .search-input { width: 100%; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  allBookings: Booking[] = [];
  searchTerm: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe(data => {
      this.allBookings = data;
    });
  }

  getTotalRevenue(): number {
    return this.allBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  }

  getActiveCount(): number {
    return this.allBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length;
  }

  filteredBookings(): Booking[] {
    if (!this.searchTerm.trim()) return this.allBookings;
    const term = this.searchTerm.toLowerCase();
    return this.allBookings.filter(b => 
      b.customerName.toLowerCase().includes(term) ||
      b.serviceName.toLowerCase().includes(term) ||
      b.id?.toString().includes(term)
    );
  }

  updateStatus(id: number, status: string): void {
    this.bookingService.updateBookingStatus(id, status).subscribe(() => {
      const found = this.allBookings.find(b => b.id === id);
      if (found) found.status = status;
    });
  }
}
