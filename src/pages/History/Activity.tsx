import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, FileText } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import StatusBadge from '../../components/feedback/StatusBadge';
import { mockActivity } from '../../data/mockActivity';
import type { Status } from '../../types';

const Activity: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | Status>('all');
  const [query, setQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'processing', label: 'Processing' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
  ];

  const filteredActivity = mockActivity.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    const matchesQuery = item.service.toLowerCase().includes(query.toLowerCase()) || 
                         item.requestId.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <MobileHeader title="Activity History" showNotifications />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <div className="search-bar" style={{ height: '44px' }}>
            <Search size={16} color="var(--color-text-tertiary)" />
            <input
              type="search"
              placeholder="Search by service or request ID..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search activity"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="tabs" style={{ marginBottom: '20px' }}>
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`tab-item${activeFilter === filter.id ? ' active' : ''}`}
              onClick={() => setActiveFilter(filter.id as any)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredActivity.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: '48px' }}>
            <div className="empty-state-icon">
              <FileText size={24} />
            </div>
            <p className="empty-state-title">No activity found</p>
            <p className="empty-state-desc">You don't have any requests matching these criteria.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {filteredActivity.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => navigate(`/activity/${item.id}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderBottom: idx < filteredActivity.length - 1 ? '1px solid var(--color-border)' : 'none',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {item.service}
                    </p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                    <span>ID: {item.requestId}</span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Activity;
