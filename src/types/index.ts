// ============================================================
// SAHAYAK — TYPE DEFINITIONS
// ============================================================

export type Status = 'completed' | 'processing' | 'pending' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  location: string;
  joinedDate: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isAvailable: boolean;
  estimatedTime?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

export interface ActivityItem {
  id: string;
  service: string;
  serviceId: string;
  description: string;
  date: string;
  status: Status;
  requestId: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
