import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container section">
      <div class="glass-card auth-card">
        <div class="auth-header text-center">
          <span class="auth-icon">✨</span>
          <h2>Welcome Back to <span class="gradient-text">AuraStudio</span></h2>
          <p>Access your studio bookings, payment receipts, and project assets.</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required placeholder="name@example.com" />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>

          <button type="submit" class="btn-primary full-width" [disabled]="isLoading">
            <span *ngIf="!isLoading">Sign In to Account ➔</span>
            <span *ngIf="isLoading">Authenticating...</span>
          </button>
        </form>

        <div class="demo-login-box">
          <p class="demo-title">⚡ Instant Demo Account Quick Login:</p>
          <div class="demo-buttons">
            <button (click)="quickLogin('alex@example.com', 'customer123')" class="btn-secondary demo-btn">
              👤 Customer Demo
            </button>
            <button (click)="quickLogin('admin@aurastudio.com', 'admin123')" class="btn-outline-glow demo-btn">
              🔑 Admin Demo
            </button>
          </div>
        </div>

        <div class="auth-footer text-center">
          <p>Don't have an account yet? <a routerLink="/signup">Create an Account</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-center { text-align: center; }
    .auth-card {
      max-width: 460px;
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

    .demo-login-box {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--border-glass);
      text-align: center;
    }
    .demo-title {
      font-size: 0.82rem;
      color: var(--primary-glow);
      font-weight: 700;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    .demo-buttons {
      display: flex;
      gap: 10px;
    }
    .demo-btn {
      flex: 1;
      padding: 8px 12px;
      font-size: 0.82rem;
      justify-content: center;
    }

    .auth-footer {
      margin-top: 24px;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
  `]
})
export class LoginComponent {
  email: string = 'alex@example.com';
  password: string = 'customer123';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  quickLogin(e: string, p: string) {
    this.email = e;
    this.password = p;
    this.onLogin();
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe(res => {
      this.isLoading = false;
      if (res.success) {
        if (res.user?.role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/customer-dashboard']);
        }
      } else {
        this.errorMessage = res.message || 'Login failed';
      }
    });
  }
}
