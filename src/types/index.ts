export type UserRole = 'user' | 'caretaker';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 for Sunday-Saturday
  time: string;
  createdBy: UserRole;
}

export interface Message {
  id: string;
  content: string;
  sender: UserRole;
  timestamp: Date;
}

export interface AppState {
  userRole: UserRole;
  events: Event[];
  messages: Message[];
  selectedDate: Date | null;
  isHighContrast: boolean;
} 