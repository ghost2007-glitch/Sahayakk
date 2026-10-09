import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { serviceCategories } from '../../data/services';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allCategories = [
    { id: 'all', name: 'All' },
    ...serviceCategories.map(c => ({ id: c.id, name: c.name })),
  ];

  const filteredCategories = serviceCategories
    .map(cat => ({
      ...cat,
      services: cat.services.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter(cat =>
      (activeCategory === 'all' || cat.id === activeCategory) &&
      cat.services.length > 0
    );

  const getIcon = (iconName: string): React.FC<{ size?: number }> => {
    return (Icons as unknown as Record<string, React.FC<{ size?: number }>>)[iconName] || Icons.FileText;
  };

  return (
    <>
      <MobileHeader title="Services" showNotifications />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        {/* Search */}
        <div style={{ marginBottom: '16px' }}>
          <div className="search-bar" style={{ height: '44px' }}>
            <Search size={16} color="var(--color-text-tertiary)" />
            <input
              type="search"
              placeholder="Search services..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search services"
            />
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="tabs" style={{ marginBottom: '20px' }}>
          {allCategories.map(cat => (
            <button
              key={cat.id}
              className={`tab-item${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services */}
        {filteredCategories.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: '48px' }}>
            <div className="empty-state-icon">
              <Search size={24} />
            </div>
            <p className="empty-state-title">No services found</p>
            <p className="empty-state-desc">Try searching for something else</p>
          </div>
        ) : (
          filteredCategories.map(category => (
            <div key={category.id} style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px',
              }}>
                {category.name}
              </h2>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {category.services.map((service, idx) => {
                  const Icon = getIcon(service.icon);
                  return (
                    <button
                      key={service.id}
                      onClick={() => navigate(`/services/${service.id}`)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 16px',
                        borderBottom: idx < category.services.length - 1 ? '1px solid var(--color-border)' : 'none',
                        background: 'none',
                        border: 'none',
                        borderRadius: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      aria-label={service.name}
                    >
                      <div className="service-icon">
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                          {service.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {service.description}
                        </p>
                      </div>
                      {service.estimatedTime && (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
                          {service.estimatedTime}
                        </span>
                      )}
                      <ChevronRight size={16} color="var(--color-text-tertiary)" style={{ flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Services;
