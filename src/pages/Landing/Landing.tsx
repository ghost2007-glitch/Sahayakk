import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MessageCircle, Grid3x3, Clock, CheckCircle, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Assistant',
    description: 'Get help with any government service through natural conversation.',
  },
  {
    icon: Grid3x3,
    title: 'All Services',
    description: 'Access 50+ government and utility services in one place.',
  },
  {
    icon: Clock,
    title: 'Track Requests',
    description: 'Monitor your application status in real time.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with bank-grade security.',
  },
];

const Landing: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <img src="/logo.png" alt="Sahayak" style={{ height: '26px', width: 'auto' }} />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/login">
            <button className="btn btn-secondary btn-sm">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-primary btn-sm">Get Started</button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '64px 24px 48px',
        maxWidth: '680px',
        margin: '0 auto',
        textAlign: 'center',
        width: '100%',
      }}>
        <span className="badge badge-info" style={{ marginBottom: '16px', display: 'inline-flex' }}>
          Digital Civic Assistant
        </span>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '16px',
        }}>
          Government services,<br />
          <span style={{ color: 'var(--color-primary)' }}>made simple.</span>
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '32px',
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          Sahayak helps you navigate government services, pay utility bills, and track document applications — all in one place, in your language.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup">
            <button className="btn btn-primary btn-lg">
              Get Started Free
              <ChevronRight size={16} />
            </button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary btn-lg">
              Sign In
            </button>
          </Link>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '16px' }}>
          No credit card required · Free to use
        </p>
      </section>

      {/* Features */}
      <section style={{
        padding: '0 24px 48px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="service-icon">
                <Icon size={18} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{title}</p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
          Trusted by citizens across India
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          {['50+ Services', '1M+ Requests', 'Secure & Private'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500 }}>
              <CheckCircle size={14} color="var(--color-success)" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <img src="/logo.png" alt="Sahayak" style={{ height: '20px', width: 'auto' }} />
        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          © 2026 Sahayak. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
