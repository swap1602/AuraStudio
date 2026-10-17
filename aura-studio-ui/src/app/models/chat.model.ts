export interface ChatMessageItem {
  id?: number;
  sender: 'User' | 'Aura AI';
  text: string;
  timestamp: string;
  isAi: boolean;
  suggestedActions?: string[];
}

export interface ChatReply {
  reply: string;
  timestamp: string;
  suggestedActions?: string[];
}
