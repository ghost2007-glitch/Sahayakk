import type { Message } from '../types';

export const initialMessages: Message[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: 'Hello! I\'m Sahayak, your digital civic assistant. I can help you with government services, utility payments, document applications, and more.\n\nWhat would you like help with today?',
    timestamp: '2026-10-08T09:00:00Z',
  },
];

export const mockConversation: Message[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: 'Hello! I\'m Sahayak, your digital civic assistant. I can help you with government services, utility payments, document applications, and more.\n\nWhat would you like help with today?',
    timestamp: '2026-10-08T09:00:00Z',
  },
  {
    id: 'msg-002',
    role: 'user',
    content: 'I need to apply for an income certificate.',
    timestamp: '2026-10-08T09:01:00Z',
  },
  {
    id: 'msg-003',
    role: 'assistant',
    content: 'I can help you apply for an Income Certificate. This is issued by your local tehsil office.\n\nTo process your application, you\'ll need:\n• Aadhaar Card\n• Ration Card or Address Proof\n• Recent Pay Slips (if salaried)\n\nThe process typically takes 3–5 working days. Would you like to start the application now?',
    timestamp: '2026-10-08T09:01:15Z',
  },
  {
    id: 'msg-004',
    role: 'user',
    content: 'Yes, please start the application.',
    timestamp: '2026-10-08T09:02:00Z',
  },
  {
    id: 'msg-005',
    role: 'assistant',
    content: 'Great! I\'ve initiated the Income Certificate application. Please fill in your details in the form that\'s been opened.\n\nYour application reference: REQ-2026-10-001\n\nI\'ll notify you once the certificate is ready for download.',
    timestamp: '2026-10-08T09:02:10Z',
  },
];

export const suggestedPrompts = [
  'How do I apply for a ration card?',
  'Pay my electricity bill',
  'Check my application status',
  'I need an income certificate',
  'Renew my driving license',
  'Apply for Ayushman Card',
];
