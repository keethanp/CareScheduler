export type UserRole = 'user' | 'caretaker';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  caretakerId?: string; // ID of the caretaker managing this user
  canSelfSchedule: boolean; // Whether user can schedule their own events
  createdAt: Date;
}

export interface CareRequest {
  id: string;
  fromCaretakerId: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 for Sunday-Saturday
  time: string;
  createdBy: string; // User ID
  userId: string; // User this event is for
}

export interface Message {
  id: string;
  content: string;
  sender: string; // User ID
  receiver: string; // User ID
  timestamp: Date;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  events: Event[];
  messages: Message[];
  careRequests: CareRequest[];
  selectedDate: Date | null;
  isHighContrast: boolean;
  isAuthenticated: boolean;
} 