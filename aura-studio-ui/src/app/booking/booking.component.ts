import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudioServiceService } from '../services/studio-service.service';
import { BookingService } from '../services/booking.service';
import { PaymentService } from '../services/payment.service';
import { AuthService } from '../services/auth.service';
import { StudioService } from '../models/service.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container section">
      <div class="page-header text-center">
        <span class="badge badge-purple">Reservation Portal</span>
        <h1>Book Your <span class="gradient-text">Studio Session</span></h1>
        <p>Instant confirmation, transparent pricing, and instant equipment gear reserve.</p>
      </div>

      <!-- Step Indicator Bar -->
      <div class="wizard-steps">
        <div class="step-item" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
          <div class="step-number">1</div>
          <span class="step-title">Suite & Time</span>
        </div>
        <div class="step-line" [class.active]="currentStep > 1"></div>
        <div class="step-item" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
          <div class="step-number">2</div>
          <span class="step-title">Gear & Add-ons</span>
        </div>
        <div class="step-line" [class.active]="currentStep > 2"></div>
        <div class="step-item" [class.active]="currentStep === 3" [class.completed]="bookingSuccess">
          <div class="step-number">3</div>
          <span class="step-title">Payment & Confirm</span>
        </div>
      </div>

      <!-- Success Screen -->
      <div *ngIf="bookingSuccess" class="glass-card glass-card-glow success-card text-center">
        <div class="success-icon">🎉</div>
        <h2>Booking Confirmed!</h2>
        <p class="success-msg">Your reservation at AuraStudio has been verified and scheduled.</p>
        
        <div class="receipt-box">
          <div class="receipt-row">
            <span>Booking Ref:</span>
            <strong>#AUR-{{ confirmedBookingId }}</strong>
          </div>
          <div class="receipt-row">
            <span>Studio Room:</span>
            <strong>{{ selectedService?.name }}</strong>
          </div>
          <div class="receipt-row">
            <span>Date & Time:</span>
            <strong>{{ bookingDate }} ({{ timeSlot }})</strong>
          </div>
          <div class="receipt-row">
            <span>Total Paid:</span>
            <strong class="gradient-text">\${{ calculateTotal() }}</strong>
          </div>
        </div>

        <div class="success-actions">
          <a routerLink="/customer-dashboard" class="btn-primary">Go to Dashboard</a>
          <button (click)="resetForm()" class="btn-secondary">Make Another Reservation</button>
        </div>
      </div>

      <!-- Step 1: Suite & Time Selection -->
      <div *ngIf="currentStep === 1 && !bookingSuccess" class="glass-card booking-card">
        <h3>Step 1: Choose Production Suite & Schedule</h3>
        
        <div class="form-group">
          <label class="form-label">Select Studio Suite</label>
          <select class="form-control" [(ngModel)]="selectedServiceName" (change)="onServiceChange()">
            <option *ngFor="let s of services" [value]="s.name">
              {{ s.name }} — \${{ s.pricePerHour }}/hr
            </option>
          </select>
        </div>

        <div *ngIf="selectedService" class="selected-suite-preview">
          <img [src]="selectedService.imageUrl" [alt]="selectedService.name" class="preview-img" />
          <div class="preview-info">
            <h4>{{ selectedService.name }}</h4>
            <p>{{ selectedService.description }}</p>
            <span class="badge badge-cyan">\${{ selectedService.pricePerHour }}/hr</span>
          </div>
        </div>

        <div class="grid-2 mt-20">
          <div class="form-group">
            <label class="form-label">Reservation Date</label>
            <input type="date" class="form-control" [(ngModel)]="bookingDate" />
          </div>

          <div class="form-group">
            <label class="form-label">Preferred Time Slot</label>
            <select class="form-control" [(ngModel)]="timeSlot">
              <option value="09:00 - 11:00">Morning (09:00 AM - 11:00 AM)</option>
              <option value="11:30 - 13:30">Midday (11:30 AM - 01:30 PM)</option>
              <option value="14:00 - 17:00">Afternoon (02:00 PM - 05:00 PM)</option>
              <option value="18:00 - 21:00">Evening (06:00 PM - 09:00 PM)</option>
              <option value="21:30 - 00:30">Night Owl (09:30 PM - 12:30 AM)</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Duration (Hours)</label>
            <input type="number" min="1" max="12" class="form-control" [(ngModel)]="durationHours" />
          </div>
          <div class="form-group">
            <label class="form-label">Your Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="customerName" placeholder="Enter your full name" />
          </div>
        </div>

        <div class="wizard-footer">
          <div></div>
          <button (click)="goToStep(2)" class="btn-primary">Continue to Gear Add-ons ➔</button>
        </div>
      </div>

      <!-- Step 2: Add-ons & Equipment -->
      <div *ngIf="currentStep === 2 && !bookingSuccess" class="glass-card booking-card">
        <h3>Step 2: Choose Equipment & Production Add-ons</h3>
        <p class="sub-text">Enhance your session with on-demand hardware and specialized crew members.</p>

        <div class="addons-grid">
          <div 
            *ngFor="let addon of availableAddons" 
            class="addon-card"
            [class.selected]="addon.selected"
            (click)="toggleAddon(addon)"
          >
            <div class="addon-checkbox">{{ addon.selected ? '✓' : '+' }}</div>
            <div class="addon-details">
              <h4>{{ addon.name }}</h4>
              <p>{{ addon.description }}</p>
              <span class="addon-price">+\${{ addon.price }}</span>
            </div>
          </div>
        </div>

        <div class="form-group mt-20">
          <label class="form-label">Special Requests / Technical Notes</label>
          <textarea class="form-control" rows="3" [(ngModel)]="specialRequests" placeholder="e.g. Need specific color gels setup, or extra mic stands..."></textarea>
        </div>

        <div class="wizard-footer">
          <button (click)="goToStep(1)" class="btn-secondary">← Back</button>
          <button (click)="goToStep(3)" class="btn-primary">Proceed to Payment ➔</button>
        </div>
      </div>

      <!-- Step 3: Payment & Summary -->
      <div *ngIf="currentStep === 3 && !bookingSuccess" class="glass-card booking-card">
        <h3>Step 3: Review Order & Payment</h3>

        <div class="grid-2">
          <div class="summary-box">
            <h4>Reservation Summary</h4>
            <div class="summary-line">
              <span>Suite:</span>
              <strong>{{ selectedService?.name }}</strong>
            </div>
            <div class="summary-line">
              <span>Base Rate:</span>
              <span>\${{ selectedService?.pricePerHour }} × {{ durationHours }} hrs = \${{ (selectedService?.pricePerHour || 0) * durationHours }}</span>
            </div>
            <div class="summary-line">
              <span>Date & Time:</span>
              <span>{{ bookingDate }} | {{ timeSlot }}</span>
            </div>
            <div class="summary-line">
              <span>Customer:</span>
              <span>{{ customerName }}</span>
            </div>
            <div class="summary-line" *ngIf="getSelectedAddonsNames()">
              <span>Add-ons:</span>
              <span>{{ getSelectedAddonsNames() }}</span>
            </div>
            <hr class="summary-divider" />
            <div class="summary-line total-line">
              <span>Total Amount Due:</span>
              <strong class="gradient-text">\${{ calculateTotal() }}</strong>
            </div>
          </div>

          <div class="payment-box">
            <h4>Payment Details</h4>
            <div class="form-group">
              <label class="form-label">Payment Method</label>
              <select class="form-control" [(ngModel)]="paymentMethod">
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="PayPal">PayPal Instant</option>
                <option value="ApplePay">Apple Pay</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Card Number</label>
              <input type="text" class="form-control" [(ngModel)]="cardNumber" placeholder="4532 •••• •••• 8921" />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Expiry Date</label>
                <input type="text" class="form-control" [(ngModel)]="expiryDate" placeholder="MM/YY" />
              </div>
              <div class="form-group">
                <label class="form-label">CVC</label>
                <input type="text" class="form-control" [(ngModel)]="cvc" placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        <div class="wizard-footer">
          <button (click)="goToStep(2)" class="btn-secondary">← Back</button>
          <button (click)="processBookingAndPayment()" class="btn-primary btn-pay" [disabled]="isSubmitting">
            <span *ngIf="!isSubmitting">Pay \${{ calculateTotal() }} & Confirm Booking ⚡</span>
            <span *ngIf="isSubmitting">Processing Payment...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-center { text-align: center; }
    .page-header { margin-bottom: 30px; }
    .page-header h1 { font-size: 2.6rem; margin: 10px 0; }

    .wizard-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 650px;
      margin: 0 auto 40px auto;
    }
    .step-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--text-muted);
      transition: var(--transition-fast);
    }
    .step-item.active .step-number {
      background: var(--primary-glow);
      color: #000;
      border-color: var(--primary-glow);
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
    }
    .step-item.completed .step-number {
      background: var(--neon-green);
      color: #000;
      border-color: var(--neon-green);
    }
    .step-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .step-line {
      flex: 1;
      height: 2px;
      background: var(--border-glass);
      margin: 0 16px 20px 16px;
    }
    .step-line.active {
      background: var(--primary-glow);
      box-shadow: 0 0 8px var(--primary-glow);
    }

    .booking-card {
      max-width: 850px;
      margin: 0 auto;
    }
    .booking-card h3 {
      font-size: 1.5rem;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 12px;
    }
    .sub-text {
      color: var(--text-muted);
      margin-bottom: 24px;
      font-size: 0.92rem;
    }
    .mt-20 { margin-top: 20px; }

    .selected-suite-preview {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-glass);
      padding: 14px;
      border-radius: var(--radius-md);
      margin-bottom: 20px;
      align-items: center;
    }
    .preview-img {
      width: 100px;
      height: 70px;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    .preview-info h4 { font-size: 1.05rem; }
    .preview-info p { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px; }

    .addons-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .addon-card {
      display: flex;
      gap: 14px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .addon-card:hover, .addon-card.selected {
      border-color: var(--primary-glow);
      background: rgba(0, 242, 254, 0.06);
    }
    .addon-checkbox {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: var(--primary-glow);
    }
    .addon-card.selected .addon-checkbox {
      background: var(--primary-glow);
      color: #000;
    }
    .addon-details h4 { font-size: 0.95rem; margin-bottom: 2px; }
    .addon-details p { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; }
    .addon-price { font-size: 0.85rem; font-weight: 700; color: var(--neon-green); }

    .wizard-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid var(--border-glass);
    }

    .summary-box, .payment-box {
      background: rgba(255, 255, 255, 0.03);
      padding: 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-glass);
    }
    .summary-box h4, .payment-box h4 {
      margin-bottom: 16px;
      font-size: 1.1rem;
      border-bottom: 1px solid var(--border-glass);
      padding-bottom: 8px;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      margin-bottom: 10px;
      color: var(--text-muted);
    }
    .summary-line strong { color: #fff; }
    .summary-divider {
      border: none;
      border-top: 1px solid var(--border-glass);
      margin: 14px 0;
    }
    .total-line {
      font-size: 1.1rem;
      font-weight: bold;
    }

    .success-card {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
    }
    .success-icon { font-size: 4rem; margin-bottom: 16px; }
    .success-msg { color: var(--text-muted); margin-bottom: 24px; }
    .receipt-box {
      background: rgba(255, 255, 255, 0.04);
      padding: 20px;
      border-radius: var(--radius-md);
      border: 1px dashed var(--primary-glow);
      margin-bottom: 30px;
      text-align: left;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 0.92rem;
    }
    .success-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
    }

    @media (max-width: 768px) {
      .addons-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BookingComponent implements OnInit {
  currentStep: number = 1;
  bookingSuccess: boolean = false;
  isSubmitting: boolean = false;
  confirmedBookingId: number = 103;

  services: StudioService[] = [];
  selectedServiceName: string = 'Photography Suite Alpha';
  selectedService: StudioService | undefined;

  bookingDate: string = new Date().toISOString().split('T')[0];
  timeSlot: string = '14:00 - 17:00';
  durationHours: number = 2;
  customerName: string = 'Alex Mercer';
  specialRequests: string = '';

  paymentMethod: string = 'Credit Card';
  cardNumber: string = '4532 8819 2031 8921';
  expiryDate: string = '12/28';
  cvc: string = '492';

  availableAddons = [
    { id: 1, name: 'Dedicated Sound Engineer', description: 'On-site audio engineer for live mixing & tracking.', price: 60, selected: false },
    { id: 2, name: '4K Cinema Video Package', description: 'Dual Sony FX3 cameras + ATEM Live switcher setup.', price: 90, selected: false },
    { id: 3, name: 'Profoto Lighting Tech', description: 'Assistant to adjust studio strobe modifiers & gels.', price: 45, selected: false },
    { id: 4, name: 'Mastering & Vocal Polish', description: 'Post-production stem bounce & vocal chain mastering.', price: 75, selected: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private studioService: StudioServiceService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.customerName = user.fullName;
    }

    this.studioService.getServices().subscribe(data => {
      this.services = data;
      this.route.queryParams.subscribe(params => {
        if (params['service']) {
          this.selectedServiceName = params['service'];
        }
        this.onServiceChange();
      });
    });
  }

  onServiceChange(): void {
    this.selectedService = this.services.find(s => s.name === this.selectedServiceName);
  }

  toggleAddon(addon: any): void {
    addon.selected = !addon.selected;
  }

  getSelectedAddonsNames(): string {
    return this.availableAddons.filter(a => a.selected).map(a => a.name).join(', ');
  }

  calculateTotal(): number {
    const base = (this.selectedService?.pricePerHour || 100) * this.durationHours;
    const addonsTotal = this.availableAddons.filter(a => a.selected).reduce((sum, a) => sum + a.price, 0);
    return base + addonsTotal;
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  processBookingAndPayment(): void {
    this.isSubmitting = true;

    const user = this.authService.currentUserValue;
    const bookingPayload = {
      userId: user?.id || 2,
      customerName: this.customerName,
      customerEmail: user?.email || 'alex@example.com',
      serviceName: this.selectedServiceName,
      studioRoom: this.selectedService?.name || this.selectedServiceName,
      bookingDate: this.bookingDate,
      timeSlot: this.timeSlot,
      durationHours: this.durationHours,
      totalAmount: this.calculateTotal(),
      status: 'Confirmed',
      specialRequests: this.specialRequests,
      addOns: this.getSelectedAddonsNames()
    };

    this.bookingService.createBooking(bookingPayload).subscribe(resBooking => {
      this.confirmedBookingId = resBooking.id || Math.floor(Math.random() * 900) + 100;

      // Process payment
      this.paymentService.processPayment({
        bookingId: this.confirmedBookingId,
        customerName: this.customerName,
        amount: this.calculateTotal(),
        paymentMethod: this.paymentMethod,
        cardNumber: this.cardNumber,
        expiryDate: this.expiryDate,
        cvc: this.cvc
      }).subscribe(() => {
        this.isSubmitting = false;
        this.bookingSuccess = true;
      });
    });
  }

  resetForm(): void {
    this.currentStep = 1;
    this.bookingSuccess = false;
    this.availableAddons.forEach(a => a.selected = false);
  }
}
