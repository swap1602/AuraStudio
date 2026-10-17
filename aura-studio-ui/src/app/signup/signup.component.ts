import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container section">
      <div class="glass-card auth-card">
        <div class="auth-header text-center">
          <span class="auth-icon">🚀</span>
          <h2>Create Your <span class="gradient-text">AuraStudio Account</span></h2>
          <p>Join thousands of artists and producers booking premier studio suites.</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSignup()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="fullName" name="fullName" required placeholder="e.g. Alex Mercer" />
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="name@example.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-control" [(ngModel)]="phone" name="phone" placeholder="+1 (555) 019-2831" />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>

          <button type="submit" class="btn-primary full-width" [disabled]="isLoading">
            <span *ngIf="!isLoading">Create Account & Book ➔</span>
            <span *ngIf="isLoading">Creating Account...</span>
          </button>
        </form>

        <div class="auth-footer text-center">
          <p>Already have an account? <a routerLink="/login">Sign In Instead</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-center { text-align: center; }
    .auth-card {
      max-width: 480px;
      margin: 40px auto;
      padding: 40px;
    }
    .auth-icon { font-size: 2.5rem; display: block; margin-bottom: 12px; }
    .auth-header h2 { font-size: 1.8rem; margin-bottom: 8px; }
    .auth-header p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px; }

    .error-banner {
      background: rgba(255, 42, 133, 0.15);
      border: 1px solid rgba(255, 42, 133, 0.4);
      color: var(--neon-pink);
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
      font-size: 0.88rem;
    }
    .full-width {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }

    .auth-footer {
      margin-top: 24px;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
  `]
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: 'Customer'
    };

    this.authService.register(payload).subscribe(res => {
      this.isLoading = false;
      if (res.success) {
        this.router.navigate(['/customer-dashboard']);
      } else {
        this.errorMessage = res.message || 'Registration failed';
      }
    });
  }
}
