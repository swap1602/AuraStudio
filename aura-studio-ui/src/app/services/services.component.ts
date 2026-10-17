import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudioServiceService } from '../services/studio-service.service';
import { StudioService } from '../models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <div class="page-header text-center">
        <span class="badge badge-cyan">Studio Specs & Rates</span>
        <h1>Our World-Class <span class="gradient-text">Studio Services</span></h1>
        <p>Acoustically treated environments, high-end cinema lighting, and industry-standard production gear.</p>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-filters">
        <button 
          *ngFor="let cat of categories" 
          (click)="selectCategory(cat)"
          [class.active]="selectedCategory === cat"
          class="filter-btn"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Studio Services Grid -->
      <div class="grid-2">
        <div *ngFor="let service of filteredServices" class="glass-card service-detail-card">
          <div class="service-image-col">
            <img [src]="service.imageUrl" [alt]="service.name" />
            <span class="badge badge-purple tag-badge">{{ service.tag }}</span>
          </div>
          
          <div class="service-content-col">
            <div class="header-row">
              <h3>{{ service.name }}</h3>
              <span class="price-pill">\${{ service.pricePerHour }}/hr</span>
            </div>
            
            <p class="category-tag">Category: {{ service.category }}</p>
            <p class="service-description">{{ service.description }}</p>

            <div class="equipment-box">
              <h4>Included Gear & Specs:</h4>
              <ul class="equipment-list">
                <li *ngFor="let eq of getEquipmentArray(service.equipmentList)">
                  <span class="eq-icon">✓</span> {{ eq }}
                </li>
              </ul>
            </div>

            <div class="action-row">
              <a [routerLink]="['/booking']" [queryParams]="{service: service.name}" class="btn-primary">
                Book This Suite ➔
              </a>
              <a [routerLink]="['/ai-chat']" class="btn-secondary">
                Ask AI About Suite
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 40px;
    }
    .page-header h1 {
      font-size: 2.8rem;
      margin: 14px 0;
    }
    .text-center { text-align: center; }

    .category-filters {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .filter-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 10px 22px;
      border-radius: 24px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .filter-btn:hover, .filter-btn.active {
      background: var(--primary-glow);
      color: #000000;
      border-color: var(--primary-glow);
      box-shadow: 0 0 18px rgba(0, 242, 254, 0.4);
    }

    .service-detail-card {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 24px;
      padding: 0;
      overflow: hidden;
    }
    .service-image-col {
      position: relative;
      height: 100%;
      min-height: 280px;
    }
    .service-image-col img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .tag-badge {
      position: absolute;
      top: 16px;
      left: 16px;
    }
    .service-content-col {
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    .header-row h3 {
      font-size: 1.35rem;
    }
    .price-pill {
      background: rgba(0, 242, 254, 0.12);
      color: var(--primary-glow);
      border: 1px solid rgba(0, 242, 254, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 1rem;
      white-space: nowrap;
    }
    .category-tag {
      font-size: 0.82rem;
      color: #c084fc;
      margin-bottom: 12px;
      font-weight: 600;
    }
    .service-description {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-bottom: 20px;
    }
    .equipment-box {
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-sm);
      padding: 14px 18px;
      margin-bottom: 24px;
    }
    .equipment-box h4 {
      font-size: 0.85rem;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .equipment-list {
      list-style: none;
    }
    .equipment-list li {
      font-size: 0.83rem;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .eq-icon {
      color: var(--neon-green);
      font-weight: bold;
    }
    .action-row {
      display: flex;
      gap: 12px;
    }

    @media (max-width: 900px) {
      .service-detail-card {
        grid-template-columns: 1fr;
      }
      .service-image-col {
        height: 220px;
      }
    }
  `]
})
export class ServicesComponent implements OnInit {
  services: StudioService[] = [];
  filteredServices: StudioService[] = [];
  categories: string[] = ['All', 'Photography', 'Audio & Music', 'Podcast', 'Video Production', 'Rehearsal'];
  selectedCategory: string = 'All';

  constructor(private studioService: StudioServiceService) {}

  ngOnInit(): void {
    this.studioService.getServices().subscribe(data => {
      this.services = data;
      this.filteredServices = data;
    });
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    if (cat === 'All') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(s => s.category.toLowerCase().includes(cat.toLowerCase()));
    }
  }

  getEquipmentArray(eqList: string): string[] {
    return eqList ? eqList.split(',').map(s => s.trim()) : [];
  }
}
