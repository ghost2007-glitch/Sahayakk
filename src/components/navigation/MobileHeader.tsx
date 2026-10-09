import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft } from 'lucide-react';
import { mockNotifications } from '../../data/mockNotifications';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  showNotifications?: boolean;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showLogo = false,
  showNotifications = true,
  rightAction,
}) => {
  const navigate = useNavigate();
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="mobile-header" style={{ display: 'flex' }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              border: 'none',
              background: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              borderRadius: '6px',
              marginLeft: '-8px',
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {showLogo && (
          <img
            src="/logo.png"
            alt="Sahayak"
            style={{ height: '24px', width: 'auto' }}
          />
        )}
        {title && (
          <h1 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}>
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {rightAction}
        {showNotifications && (
          <button
            onClick={() => navigate('/notifications')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              border: 'none',
              background: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              borderRadius: '6px',
              position: 'relative',
            }}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-dot" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
