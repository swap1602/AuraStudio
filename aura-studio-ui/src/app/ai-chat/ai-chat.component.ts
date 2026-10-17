import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiChatService } from '../services/ai-chat.service';
import { ChatMessageItem } from '../models/chat.model';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container section">
      <div class="page-header text-center">
        <span class="badge badge-purple">AI Concierge & Consultant</span>
        <h1>Aura <span class="gradient-text">AI Assistant</span></h1>
        <p>Ask about studio rooms, equipment gear specs, rates, slot availability, or session planning.</p>
      </div>

      <div class="glass-card chat-wrapper">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="ai-bot-avatar">
            <span>✨</span>
            <span class="bot-online-dot"></span>
          </div>
          <div>
            <h3>Aura AI Assistant</h3>
            <span class="bot-status">Online • 24/7 Studio Concierge</span>
          </div>
        </div>

        <!-- Chat Message Log -->
        <div class="chat-body" #chatContainer>
          <div 
            *ngFor="let msg of messages" 
            class="chat-bubble-wrap"
            [class.user-bubble]="!msg.isAi"
            [class.ai-bubble]="msg.isAi"
          >
            <div class="bubble-sender" *ngIf="msg.isAi">
              <span class="bubble-icon">🤖</span> Aura AI
            </div>

            <div class="bubble-content" [innerHTML]="formatMessageText(msg.text)"></div>

            <div class="bubble-time">{{ msg.timestamp | date:'shortTime' }}</div>

            <!-- Quick Action Chips -->
            <div *ngIf="msg.suggestedActions && msg.suggestedActions.length > 0" class="actions-chips">
              <button 
                *ngFor="let act of msg.suggestedActions" 
                (click)="onActionClick(act)" 
                class="chip-btn"
              >
                {{ act }} ➔
              </button>
            </div>
          </div>

          <div *ngIf="isTyping" class="chat-bubble-wrap ai-bubble">
            <div class="bubble-content typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>

        <!-- Quick Question Suggestions -->
        <div class="chat-quick-suggestions">
          <button (click)="sendPreset('What are the hourly rates for all studios?')" class="preset-btn">
            💰 Hourly Rates
          </button>
          <button (click)="sendPreset('What gear is inside Photography Suite Alpha?')" class="preset-btn">
            📸 Photo Cyclorama Gear
          </button>
          <button (click)="sendPreset('What mics are in the Podcast Lounge?')" class="preset-btn">
            🎙️ Podcast Mics
          </button>
          <button (click)="sendPreset('How do I book a session?')" class="preset-btn">
            📅 Booking Steps
          </button>
        </div>

        <!-- Chat Input Form -->
        <div class="chat-footer">
          <input 
            type="text" 
            class="form-control chat-input" 
            [(ngModel)]="userPrompt" 
            (keyup.enter)="sendMessage()" 
            placeholder="Ask Aura AI anything about studio suites, microphones, lighting..." 
            [disabled]="isTyping"
          />
          <button (click)="sendMessage()" class="btn-primary btn-send" [disabled]="!userPrompt.trim() || isTyping">
            <span>Send</span>
            <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 30px; }
    .page-header h1 { font-size: 2.6rem; margin: 10px 0; }
    .text-center { text-align: center; }

    .chat-wrapper {
      max-width: 850px;
      margin: 0 auto;
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 680px;
    }
    .chat-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 28px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border-glass);
    }
    .ai-bot-avatar {
      position: relative;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00f2fe 0%, #7f00ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
    }
    .bot-online-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background: var(--neon-green);
      border-radius: 50%;
      border: 2px solid #090a10;
    }
    .chat-header h3 { font-size: 1.15rem; }
    .bot-status { font-size: 0.8rem; color: var(--text-muted); }

    .chat-body {
      flex: 1;
      padding: 28px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .chat-bubble-wrap {
      display: flex;
      flex-direction: column;
      max-width: 80%;
    }
    .user-bubble {
      align-self: flex-end;
    }
    .user-bubble .bubble-content {
      background: linear-gradient(135deg, #00f2fe 0%, #00a8ff 100%);
      color: #000000;
      font-weight: 500;
      border-radius: 18px 18px 2px 18px;
    }
    .ai-bubble {
      align-self: flex-start;
    }
    .ai-bubble .bubble-content {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: #ffffff;
      border-radius: 18px 18px 18px 2px;
    }

    .bubble-sender {
      font-size: 0.78rem;
      font-weight: 700;
      color: #c084fc;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .bubble-content {
      padding: 14px 20px;
      font-size: 0.93rem;
      line-height: 1.5;
    }
    .bubble-time {
      font-size: 0.72rem;
      color: var(--text-dim);
      margin-top: 4px;
      align-self: flex-end;
    }

    .actions-chips {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .chip-btn {
      background: rgba(0, 242, 254, 0.12);
      border: 1px solid rgba(0, 242, 254, 0.3);
      color: var(--primary-glow);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .chip-btn:hover {
      background: var(--primary-glow);
      color: #000;
    }

    .typing-indicator span {
      animation: blink 1.4s infinite fill-mode: both;
      font-size: 1.5rem;
      margin: 0 2px;
    }
    .typing-indicator span:nth-child(2) { animation-delay: .2s; }
    .typing-indicator span:nth-child(3) { animation-delay: .4s; }
    @keyframes blink {
      0% { opacity: .2; }
      20% { opacity: 1; }
      100% { opacity: .2; }
    }

    .chat-quick-suggestions {
      display: flex;
      gap: 8px;
      padding: 10px 28px;
      overflow-x: auto;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid var(--border-glass);
    }
    .preset-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 16px;
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;
      transition: var(--transition-fast);
    }
    .preset-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .chat-footer {
      display: flex;
      gap: 12px;
      padding: 20px 28px;
      border-top: 1px solid var(--border-glass);
      background: rgba(9, 10, 16, 0.95);
    }
    .chat-input {
      flex: 1;
      padding: 14px 20px;
      font-size: 0.95rem;
    }
    .btn-send {
      padding: 0 24px;
    }
  `]
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userPrompt: string = '';
  isTyping: boolean = false;

  messages: ChatMessageItem[] = [
    {
      sender: 'Aura AI',
      text: "👋 Welcome to **AuraStudio**! I'm Aura AI, your creative production consultant. Ask me about studio suite specs, equipment lists, hourly rates, or slot availability!",
      timestamp: new Date().toISOString(),
      isAi: true,
      suggestedActions: ['Check Rates', 'View Gear', 'Book Session']
    }
  ];

  constructor(private chatService: AiChatService) {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  sendPreset(text: string): void {
    this.userPrompt = text;
    this.sendMessage();
  }

  onActionClick(action: string): void {
    if (action.includes('Book')) {
      window.location.href = '/booking';
    } else {
      this.sendPreset(`Tell me about: ${action}`);
    }
  }

  sendMessage(): void {
    if (!this.userPrompt.trim() || this.isTyping) return;

    const userText = this.userPrompt.trim();
    this.messages.push({
      sender: 'User',
      text: userText,
      timestamp: new Date().toISOString(),
      isAi: false
    });

    this.userPrompt = '';
    this.isTyping = true;

    this.chatService.sendMessage(userText).subscribe(res => {
      this.isTyping = false;
      this.messages.push({
        sender: 'Aura AI',
        text: res.reply,
        timestamp: res.timestamp || new Date().toISOString(),
        isAi: true,
        suggestedActions: res.suggestedActions
      });
    });
  }

  formatMessageText(text: string): string {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
    return formatted;
  }
}
