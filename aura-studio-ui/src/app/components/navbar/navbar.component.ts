import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-icon">✨</span>
          <span class="logo-text">AURA<span class="gradient-text">STUDIO</span></span>
        </a>

        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/services" routerLinkActive="active">Services & Gear</a>
          <a routerLink="/booking" routerLinkActive="active">Book Studio</a>
          <a routerLink="/ai-chat" routerLinkActive="active" class="ai-badge-link">
            <span>Aura AI</span>
            <span class="nav-pulse-dot"></span>
          </a>

          <ng-container *ngIf="authService.currentUser$ | async as user; else guestNav">
            <a *ngIf="!authService.isAdmin" routerLink="/customer-dashboard" routerLinkActive="active" class="dash-link">
              <span>Dashboard</span>
            </a>
            <a *ngIf="authService.isAdmin" routerLink="/admin-dashboard" routerLinkActive="active" class="admin-badge-link">
              <span>Admin Panel</span>
            </a>
            
            <div class="user-menu">
              <span class="user-greeting">Hi, {{ user.fullName }}</span>
              <button (click)="logout()" class="btn-logout">Logout</button>
            </div>
          </ng-container>

          <ng-template #guestNav>
            <div class="auth-buttons">
              <a routerLink="/login" class="btn-secondary nav-btn">Sign In</a>
              <a routerLink="/signup" class="btn-primary nav-btn">Get Started</a>
            </div>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(9, 10, 16, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glass);
      padding: 16px 0;
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
    }
    .logo-icon {
      font-size: 1.6rem;
    }
    .logo-text {
      letter-spacing: 0.04em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }
    .nav-links a {
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #ffffff;
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-glow);
      border-radius: 2px;
      box-shadow: 0 0 8px var(--primary-glow);
    }
    .ai-badge-link {
      background: rgba(127, 0, 255, 0.15);
      border: 1px solid rgba(192, 132, 252, 0.4);
      padding: 6px 14px;
      border-radius: 20px;
      color: #c084fc !important;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .nav-pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--primary-glow);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary-glow);
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.4; }
      100% { transform: scale(1); opacity: 1; }
    }
    .auth-buttons {
      display: flex;
      gap: 12px;
    }
    .nav-btn {
      padding: 8px 18px;
      font-size: 0.88rem;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 14px;
      border-radius: 30px;
      border: 1px solid var(--border-glass);
    }
    .user-greeting {
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
    }
    .btn-logout {
      background: transparent;
      border: none;
      color: var(--neon-pink);
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
    }
    .admin-badge-link {
      background: rgba(255, 42, 133, 0.15) !important;
      border: 1px solid rgba(255, 42, 133, 0.4) !important;
      padding: 6px 14px;
      border-radius: 20px;
      color: var(--neon-pink) !important;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
