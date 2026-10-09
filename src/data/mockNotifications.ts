import type { Notification } from '../types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Income Certificate Ready',
    description: 'Your income certificate application REQ-2026-10-001 has been approved and is ready for download.',
    time: '2 hours ago',
    isRead: false,
    type: 'success',
  },
  {
    id: 'notif-002',
    title: 'Electricity Bill Due',
    description: 'Your MSEDCL electricity bill of ₹1,450 is due on October 15, 2026.',
    time: '5 hours ago',
    isRead: false,
    type: 'warning',
  },
  {
    id: 'notif-003',
    title: 'Driving License Pending',
    description: 'Your driving license renewal application is pending document verification at RTO.',
    time: '1 day ago',
    isRead: true,
    type: 'info',
  },
  {
    id: 'notif-004',
    title: 'Water Bill Payment Failed',
    description: 'Your water bill payment of ₹680 could not be processed. Please retry.',
    time: '3 days ago',
    isRead: true,
    type: 'error',
  },
  {
    id: 'notif-005',
    title: 'Ration Card Approved',
    description: 'Your ration card application has been approved. Visit your local FPS with Aadhaar for collection.',
    time: '1 week ago',
    isRead: true,
    type: 'success',
  },
];
