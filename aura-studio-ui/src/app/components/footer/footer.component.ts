import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="logo">
            <span class="logo-icon">✨</span>
            <span class="logo-text">AURA<span class="gradient-text">STUDIO</span></span>
          </div>
          <p class="footer-desc">
            Next-generation creative space equipped with cycloramas, Dolby Atmos mixing rooms, 4K broadcast lounges, and AI-powered production booking.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon">📷</a>
            <a href="#" class="social-icon">🎵</a>
            <a href="#" class="social-icon">🎥</a>
            <a href="#" class="social-icon">🌐</a>
          </div>
        </div>

        <div class="footer-links">
          <h4>Studio Spaces</h4>
          <ul>
            <li><a routerLink="/services">Photography Suite Alpha</a></li>
            <li><a routerLink="/services">Dolby Atmos Music Studio</a></li>
            <li><a routerLink="/services">4K Podcast Lounge</a></li>
            <li><a routerLink="/services">Cinema Soundstage</a></li>
            <li><a routerLink="/services">Rehearsal Space</a></li>
          </ul>
        </div>

        <div class="footer-links">
          <h4>Quick Navigation</h4>
          <ul>
            <li><a routerLink="/">Home Showcase</a></li>
            <li><a routerLink="/services">All Services & Gear</a></li>
            <li><a routerLink="/booking">Book Studio Session</a></li>
            <li><a routerLink="/ai-chat">Aura AI Assistant</a></li>
            <li><a routerLink="/login">Client Portal Login</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>Visit & Contact</h4>
          <p>📍 450 Creative Blvd, District 7, NY 10012</p>
          <p>📞 +1 (800) 555-AURA</p>
          <p>✉️ info&#64;aurastudio.com</p>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span>Studio Open - Slots Available</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>&copy; 2026 AuraStudio Inc. All Rights Reserved. Built with ASP.NET Core & Angular.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(6, 7, 11, 0.95);
      border-top: 1px solid var(--border-glass);
      padding-top: 60px;
      margin-top: 100px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 40px;
      padding-bottom: 50px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
    }
    .footer-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 20px;
      max-width: 340px;
    }
    .social-links {
      display: flex;
      gap: 12px;
    }
    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-fast);
    }
    .social-icon:hover {
      background: rgba(0, 242, 254, 0.15);
      border-color: var(--primary-glow);
    }
    .footer-links h4, .footer-contact h4 {
      font-size: 1.05rem;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .footer-links ul {
      list-style: none;
    }
    .footer-links li {
      margin-bottom: 10px;
    }
    .footer-links a {
      color: var(--text-muted);
      font-size: 0.88rem;
    }
    .footer-links a:hover {
      color: var(--primary-glow);
    }
    .footer-contact p {
      color: var(--text-muted);
      font-size: 0.88rem;
      margin-bottom: 10px;
    }
    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
      color: var(--neon-green);
      font-size: 0.8rem;
      font-weight: 600;
      margin-top: 10px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--neon-green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--neon-green);
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 20px 0;
      color: var(--text-dim);
      font-size: 0.82rem;
      text-align: center;
    }
    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FooterComponent {}
