import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageCircle,
  Grid3x3,
  Clock,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/assistant', icon: MessageCircle, label: 'Assistant' },
  { to: '/services', icon: Grid3x3, label: 'Services' },
  { to: '/activity', icon: Clock, label: 'Activity' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            className={`bottom-nav-item${isActive ? ' active' : ''}`}
            aria-label={label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
