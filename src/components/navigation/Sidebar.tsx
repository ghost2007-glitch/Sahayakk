import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  Grid3x3,
  Clock,
  User,
  Settings,
  HelpCircle,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';

const mainNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assistant', icon: MessageCircle, label: 'AI Assistant' },
  { to: '/services', icon: Grid3x3, label: 'Services' },
  { to: '/activity', icon: Clock, label: 'Activity' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const secondaryNavItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/help', icon: HelpCircle, label: 'Help & Support' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  
  const name = profile?.full_name || 'Citizen';
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const email = user?.email || '';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="desktop-sidebar" role="navigation" aria-label="Sidebar navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Go to dashboard"
        >
          <img
            src="/logo.png"
            alt="Sahayak"
            style={{ height: '28px', width: 'auto' }}
          />
        </button>
      </div>

      {/* Main nav */}
      <nav className="sidebar-nav">
        {mainNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </NavLink>
          );
        })}

        <div className="divider" style={{ margin: '8px 20px' }} />

        {secondaryNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`sidebar-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-nav-item" style={{ cursor: 'default', pointerEvents: 'none' }}>
          <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {email}
            </p>
          </div>
        </div>
        <button
          className="sidebar-nav-item"
          onClick={handleLogout}
          style={{ width: '100%', color: 'var(--color-error-text)' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
