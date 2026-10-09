import React, { useState } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { mockNotifications } from '../../data/mockNotifications';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle size={18} color="var(--color-success)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--color-warning-text)" />;
      case 'error': return <AlertCircle size={18} color="var(--color-error-text)" />;
      default: return <Info size={18} color="var(--color-info-text)" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'success': return 'var(--color-success-bg)';
      case 'warning': return 'var(--color-warning-bg)';
      case 'error': return 'var(--color-error-bg)';
      default: return 'var(--color-info-bg)';
    }
  };

  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  return (
    <>
      <MobileHeader 
        title="Notifications" 
        showBack 
        showNotifications={false} 
        rightAction={
          notifications.some(n => !n.isRead) ? (
            <button onClick={markAllRead} style={{ fontSize: '13px', color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 500 }}>
              Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        {notifications.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: '48px' }}>
            <div className="empty-state-icon">
              <Bell size={24} />
            </div>
            <p className="empty-state-title">No notifications yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(n => (
              <div 
                key={n.id} 
                className="card" 
                style={{ 
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  border: n.isRead ? '1px solid var(--color-border)' : '1px solid var(--color-primary-border)',
                  background: n.isRead ? 'var(--color-surface)' : 'var(--color-bg)',
                  boxShadow: n.isRead ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.08)'
                }}
              >
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  background: getBg(n.type), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{n.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{n.time}</p>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
