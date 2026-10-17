import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/booking';

  private mockBookings: Booking[] = [
    {
      id: 101,
      userId: 2,
      customerName: 'Alex Mercer',
      customerEmail: 'alex@example.com',
      serviceName: 'Dolby Atmos Music & Recording Studio',
      studioRoom: 'Studio Room B (Audio)',
      bookingDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '14:00 - 17:00',
      durationHours: 3,
      totalAmount: 450,
      status: 'Confirmed',
      specialRequests: 'Need sound engineer present for vocal tracking.',
      addOns: 'Sound Engineer, Neumann Mic Upgrade',
      createdAt: new Date().toISOString()
    },
    {
      id: 102,
      userId: 2,
      customerName: 'Alex Mercer',
      customerEmail: 'alex@example.com',
      serviceName: '4K Podcast & Broadcast Lounge',
      studioRoom: 'Podcast Suite 1',
      bookingDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      timeSlot: '10:00 - 12:00',
      durationHours: 2,
      totalAmount: 190,
      status: 'Confirmed',
      specialRequests: 'Recording 4-person video podcast.',
      addOns: '4K Video Recording Package',
      createdAt: new Date().toISOString()
    }
  ];

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl).pipe(
      catchError(() => of(this.mockBookings))
    );
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(() => of(this.mockBookings.filter(b => b.userId === userId)))
    );
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking).pipe(
      catchError(() => {
        const newBooking = { ...booking, id: Math.floor(Math.random() * 1000) + 200, status: 'Confirmed' };
        this.mockBookings.unshift(newBooking);
        return of(newBooking);
      })
    );
  }

  updateBookingStatus(id: number, status: string): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(() => {
        const found = this.mockBookings.find(b => b.id === id);
        if (found) found.status = status;
        return of(found || ({} as Booking));
      })
    );
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockBookings.find(b => b.id === id);
        if (found) found.status = 'Cancelled';
        return of({ message: 'Cancelled' });
      })
    );
  }
}
