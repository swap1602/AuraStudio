import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudioServiceService } from '../services/studio-service.service';
import { StudioService } from '../models/service.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero-bg-glow"></div>
      <div class="container hero-content">
        <div class="badge badge-purple hero-badge">
          ✨ Premier Creative Production Studio
        </div>
        <h1 class="hero-title">
          Where Creative Vision Meets <span class="gradient-text">World-Class Acoustics</span> & Lighting
        </h1>
        <p class="hero-sub">
          Book modular photography cycloramas, Dolby Atmos 7.1.4 mixing suites, 4K multi-cam podcast lounges, and cinema green stages — backed by intelligent booking & gear support.
        </p>
        
        <div class="hero-actions">
          <a routerLink="/booking" class="btn-primary btn-hero">
            <span>Book Studio Now</span>
            <span>⚡</span>
          </a>
          <a routerLink="/services" class="btn-secondary btn-hero">
            <span>Explore All Spaces</span>
            <span>➔</span>
          </a>
        </div>

        <!-- Quick Stats Banner -->
        <div class="stats-bar glass-card">
          <div class="stat-item">
            <span class="stat-value gradient-text">5+</span>
            <span class="stat-label">Specialized Suites</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value gradient-text">4K / 8K</span>
            <span class="stat-label">RED & Sony Rigging</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value gradient-text">99.8%</span>
            <span class="stat-label">Client Satisfaction</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value gradient-text">24/7</span>
            <span class="stat-label">AI Concierge Support</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Studio Showcase Section -->
    <section class="section container">
      <div class="section-header text-center">
        <span class="badge badge-cyan">Featured Production Spaces</span>
        <h2>Choose Your <span class="gradient-text">Creative Sanctuary</span></h2>
        <p>Engineered for artists, producers, photographers, content creators, and film crews.</p>
      </div>

      <div class="grid-3">
        <div *ngFor="let s of featuredServices" class="glass-card service-card">
          <div class="card-img-wrap">
            <img [src]="s.imageUrl" [alt]="s.name" class="card-img" />
            <span class="badge badge-purple card-tag">{{ s.tag }}</span>
            <span class="card-price">\${{ s.pricePerHour }}<span>/hr</span></span>
          </div>
          <div class="card-body">
            <h3>{{ s.name }}</h3>
            <p class="card-desc">{{ s.description }}</p>
            <div class="equipment-preview">
              <span class="eq-title">Included Gear:</span>
              <p class="eq-list">{{ s.equipmentList }}</p>
            </div>
            <div class="card-footer">
              <a [routerLink]="['/booking']" [queryParams]="{service: s.name}" class="btn-outline-glow full-width">
                Book This Suite
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive AI Assistant Banner -->
    <section class="section container">
      <div class="glass-card glass-card-glow ai-banner">
        <div class="ai-banner-content">
          <span class="badge badge-purple">AI Production Assistant</span>
          <h2>Not Sure Which Studio Fits Your Project?</h2>
          <p>Chat with **Aura AI** to estimate project costs, check equipment recommendations, or find exact available time slots in seconds.</p>
          <a routerLink="/ai-chat" class="btn-primary">
            <span>Ask Aura AI Now</span>
            <span>🤖</span>
          </a>
        </div>
        <div class="ai-banner-badge">
          <div class="ai-avatar">✨</div>
          <div class="ai-pulse-ring"></div>
        </div>
      </div>
    </section>

    <!-- Testimonials & Trust -->
    <section class="section container">
      <div class="section-header text-center">
        <span class="badge badge-green">Creator Testimonials</span>
        <h2>Loved By Top <span class="gradient-text">Producers & Directors</span></h2>
      </div>

      <div class="grid-3">
        <div class="glass-card testimonial-card">
          <div class="rating">★★★★★</div>
          <p class="quote">"The acoustic tuning in the Dolby Atmos room is unreal. The SSL console worked flawlessly for our album mix!"</p>
          <div class="author">
            <span class="author-name">Marcus Vance</span>
            <span class="author-title">Grammy-Nominated Audio Engineer</span>
          </div>
        </div>

        <div class="glass-card testimonial-card">
          <div class="rating">★★★★★</div>
          <p class="quote">"The photography cyclorama with pre-rigged Profoto lighting saved us 2 hours of setup time. Outstanding studio!"</p>
          <div class="author">
            <span class="author-name">Sophia Chen</span>
            <span class="author-title">Fashion & Editorial Photographer</span>
          </div>
        </div>

        <div class="glass-card testimonial-card">
          <div class="rating">★★★★★</div>
          <p class="quote">"Booking through AuraStudio is completely seamless. The AI assistant helped us pick the exact camera package we needed."</p>
          <div class="author">
            <span class="author-name">David Sterling</span>
            <span class="author-title">Tech Podcast Network Host</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      padding: 100px 0 80px 0;
      text-align: center;
      overflow: hidden;
    }
    .hero-bg-glow {
      position: absolute;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 400px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(127, 0, 255, 0.12) 50%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 900px;
    }
    .hero-badge {
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 20px;
    }
    .hero-sub {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 750px;
      margin: 0 auto 36px auto;
    }
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 60px;
    }
    .btn-hero {
      padding: 14px 34px;
      font-size: 1.05rem;
    }
    .stats-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 24px 40px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      font-family: var(--font-heading);
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-glass);
    }

    .section {
      padding: 60px 0;
    }
    .section-header {
      margin-bottom: 48px;
    }
    .section-header h2 {
      font-size: 2.4rem;
      margin: 12px 0;
    }
    .section-header p {
      color: var(--text-muted);
    }
    .text-center { text-align: center; }

    .service-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-img-wrap {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .service-card:hover .card-img {
      transform: scale(1.06);
    }
    .card-tag {
      position: absolute;
      top: 14px;
      left: 14px;
    }
    .card-price {
      position: absolute;
      bottom: 14px;
      right: 14px;
      background: rgba(9, 10, 16, 0.85);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--primary-glow);
      border: 1px solid var(--border-glass);
    }
    .card-price span {
      font-size: 0.8rem;
      font-weight: 400;
      color: var(--text-muted);
    }
    .card-body {
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .card-body h3 {
      font-size: 1.25rem;
      margin-bottom: 10px;
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 16px;
      flex: 1;
    }
    .equipment-preview {
      background: rgba(255, 255, 255, 0.03);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      margin-bottom: 20px;
    }
    .eq-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--primary-glow);
      text-transform: uppercase;
    }
    .eq-list {
      font-size: 0.82rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .full-width {
      width: 100%;
      text-align: center;
      justify-content: center;
    }

    .ai-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 50px;
      background: linear-gradient(135deg, rgba(18, 20, 32, 0.9) 0%, rgba(30, 20, 50, 0.9) 100%);
    }
    .ai-banner-content h2 {
      font-size: 2rem;
      margin: 12px 0;
    }
    .ai-banner-content p {
      color: var(--text-muted);
      margin-bottom: 24px;
      max-width: 600px;
    }
    .ai-banner-badge {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ai-avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      box-shadow: 0 0 30px rgba(0, 242, 254, 0.5);
    }

    .testimonial-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .rating {
      color: var(--warning-amber);
      font-size: 1.1rem;
      margin-bottom: 12px;
    }
    .quote {
      font-style: italic;
      color: var(--text-main);
      margin-bottom: 20px;
      font-size: 0.95rem;
    }
    .author-name {
      display: block;
      font-weight: 700;
      color: #ffffff;
      font-size: 0.9rem;
    }
    .author-title {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.3rem; }
      .stats-bar { flex-direction: column; gap: 16px; }
      .stat-divider { display: none; }
      .ai-banner { flex-direction: column; text-align: center; gap: 30px; }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredServices: StudioService[] = [];

  constructor(private studioService: StudioServiceService) { }

  ngOnInit(): void {
    this.studioService.getServices().subscribe(data => {
      this.featuredServices = data;
    });
  }
}
