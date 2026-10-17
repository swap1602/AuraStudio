import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatReply } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiUrl = 'http://localhost:5000/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatReply> {
    return this.http.post<ChatReply>(this.apiUrl, { message }).pipe(
      catchError(() => {
        // Dynamic client fallback if server unavailable
        return of({
          reply: `✨ **Aura AI Studio Concierge:**\nThank you for asking about "${message}". AuraStudio provides Photography Cycloramas, Dolby Atmos Recording, 4K Podcasting, and Green Screen Stages. How can we assist your production?`,
          timestamp: new Date().toISOString(),
          suggestedActions: ['Book Studio', 'Check Rates', 'View Gear']
        });
      })
    );
  }
}
