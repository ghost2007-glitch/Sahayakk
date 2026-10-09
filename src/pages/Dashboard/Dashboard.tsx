import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Grid3x3,
  Clock,
  ChevronRight,
  Zap,
  FileText,
  Car,
  CreditCard,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import StatusBadge from '../../components/feedback/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { mockActivity } from '../../data/mockActivity';

const quickActions = [
  { label: 'Assistant', icon: MessageCircle, to: '/assistant', color: '#2563EB' },
  { label: 'Services', icon: Grid3x3, to: '/services', color: '#7C3AED' },
  { label: 'Activity', icon: Clock, to: '/activity', color: '#059669' },
  { label: 'Pay Bills', icon: Zap, to: '/services?category=utilities', color: '#D97706' },
];

const popularServices = [
  { id: 'electricity-bill', name: 'Electricity Bill', icon: Zap },
  { id: 'income-cert', name: 'Income Certificate', icon: FileText },
  { id: 'driving-license', name: 'Driving License', icon: Car },
  { id: 'pan-card', name: 'PAN Card', icon: CreditCard },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const recentActivity = mockActivity.slice(0, 3);

  const statsCards = [
    { label: 'Total Requests', value: mockActivity.length.toString(), icon: FileText },
    { label: 'Completed', value: mockActivity.filter(a => a.status === 'completed').length.toString(), icon: TrendingUp },
    { label: 'In Progress', value: mockActivity.filter(a => a.status === 'processing' || a.status === 'pending').length.toString(), icon: Clock },
  ];

  const { profile } = useAuth();
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Citizen';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <MobileHeader showLogo showNotifications />

      <div className="page-container">
        {/* Greeting */}
        <div style={{ marginBottom: '20px', paddingTop: '4px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>
            {greeting},
          </p>
          <h1 className="page-title">{firstName} 👋</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            How can Sahayak help you today?
          </p>
        </div>

        {/* AI Assistant CTA */}
        <button
          onClick={() => navigate('/assistant')}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'var(--color-primary)',
            border: 'none',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'white',
          }}
          aria-label="Open AI Assistant"
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <MessageCircle size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '2px' }}>Ask Sahayak</p>
            <p style={{ fontSize: '13px', opacity: 0.85 }}>
              "Help me apply for an income certificate..."
            </p>
          </div>
          <ArrowRight size={18} style={{ opacity: 0.8, flexShrink: 0 }} />
        </button>

        {/* Quick Actions */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '16px' }}>Quick Actions</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}>
            {quickActions.map(({ label, icon: Icon, to }) => (
              <button
                key={to}
                className="quick-action"
                onClick={() => navigate(to)}
                aria-label={label}
              >
                <div className="quick-action-icon">
                  <Icon size={18} />
                </div>
                <span className="quick-action-label">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {statsCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Icon size={14} color="var(--color-text-secondary)" />
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Popular Services */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '16px' }}>Popular Services</h2>
            <button
              onClick={() => navigate('/services')}
              style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {popularServices.map(({ id, name, icon: Icon }, idx) => (
              <button
                key={id}
                onClick={() => navigate(`/services/${id}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: idx < popularServices.length - 1 ? '1px solid var(--color-border)' : 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                aria-label={name}
              >
                <div className="service-icon" style={{ width: '36px', height: '36px' }}>
                  <Icon size={16} />
                </div>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {name}
                </span>
                <ChevronRight size={16} color="var(--color-text-tertiary)" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: '16px' }}>
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: '16px' }}>Recent Activity</h2>
            <button
              onClick={() => navigate('/activity')}
              style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {recentActivity.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => navigate(`/activity/${item.id}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--color-border)' : 'none',
                  background: 'none',
                  border: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.service}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
