import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudioService } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class StudioServiceService {
  private apiUrl = 'http://localhost:5000/api/services';

  // Fallback initial data in case server is starting up
  private mockServices: StudioService[] = [
    {
      id: 1,
      name: 'Photography Suite Alpha',
      category: 'Photography',
      description: 'High-ceiling cyclorama wall with Profoto lighting grid, motorized backdrops, and private makeup station.',
      pricePerHour: 120,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      equipmentList: 'Profoto D2 1000W Flash, Octabox 5ft, Tethering Station, C-Stands, Color Gels',
      tag: 'Popular'
    },
    {
      id: 2,
      name: 'Dolby Atmos Music & Recording Studio',
      category: 'Audio & Music',
      description: 'Acoustically tuned control room with SSL Duality Console, Neumann U87 mics, and Genelec 7.1.4 Atmos setup.',
      pricePerHour: 150,
      imageUrl: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80',
      equipmentList: 'SSL Console, Neumann U87 Ai, Universal Audio Apollo x16, Moog Synthesizers, Vocal Booth',
      tag: 'Premium'
    },
    {
      id: 3,
      name: '4K Podcast & Broadcast Lounge',
      category: 'Podcast',
      description: 'Soundproof multi-cam broadcast setup with warm ambient RGB lighting, Shure SM7B mics, and live switching equipment.',
      pricePerHour: 95,
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
      equipmentList: '4x Shure SM7B Mics, Blackmagic ATEM Mini Pro, Sony FX3 Cameras, Custom Podcast Desk',
      tag: 'Bestseller'
    },
    {
      id: 4,
      name: 'Cinema & Green Screen Soundstage',
      category: 'Video Production',
      description: 'Spacious 1,500 sq ft soundstage featuring 180° green screen, RED V-Raptor cameras, and heavy-duty ceiling trusses.',
      pricePerHour: 220,
      imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      equipmentList: 'RED V-Raptor 8K VV, ARRI SkyPanels, Wireless Video Transmission, Teleprompter',
      tag: 'Pro Stage'
    },
    {
      id: 5,
      name: 'Dance & Performance Rehearsal Studio',
      category: 'Rehearsal',
      description: 'Sprung hardwood flooring, full mirrored wall, high-powered JBL sound system, and atmospheric LED mood lighting.',
      pricePerHour: 80,
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      equipmentList: 'JBL PRX 1500W Speakers, Full Mirrored Wall, Ballet Barres, Bluetooth Audio Mixer',
      tag: 'Spacious'
    }
  ];

  constructor(private http: HttpClient) {}

  getServices(): Observable<StudioService[]> {
    return this.http.get<StudioService[]>(this.apiUrl).pipe(
      catchError(() => of(this.mockServices))
    );
  }

  getServiceById(id: number): Observable<StudioService | undefined> {
    return this.http.get<StudioService>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.mockServices.find(s => s.id === id)))
    );
  }
}
