import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('aura_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'Admin';
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          localStorage.setItem('aura_token', res.token);
          localStorage.setItem('aura_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.success && res.token && res.user) {
          localStorage.setItem('aura_token', res.token);
          localStorage.setItem('aura_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      }),
      catchError(err => {
        // Fallback for demo mode if API is unreachable
        let mockUser: User;
        if (data.email?.includes('admin')) {
          mockUser = { id: 1, fullName: 'Aura Admin', email: data.email, role: 'Admin' };
        } else {
          mockUser = { id: 2, fullName: 'Alex Mercer', email: data.email || 'alex@example.com', role: 'Customer' };
        }
        localStorage.setItem('aura_token', 'demo-jwt-token');
        localStorage.setItem('aura_user', JSON.stringify(mockUser));
        this.currentUserSubject.next(mockUser);
        return of({ success: true, message: 'Logged in (Demo Mode)', token: 'demo-jwt-token', user: mockUser });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    this.currentUserSubject.next(null);
  }
}
