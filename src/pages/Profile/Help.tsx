import React from 'react';
import { Mail, Phone, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';

const Help: React.FC = () => {
  const faqs = [
    "How do I track my application status?",
    "What documents do I need for a ration card?",
    "How do I update my Aadhaar details?",
    "My payment failed but money was deducted.",
  ];

  return (
    <>
      <MobileHeader title="Help & Support" showBack showNotifications={false} />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        
        {/* Contact options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '20px 12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={20} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Call Us</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>1800-XXX-XXXX</p>
            </div>
          </div>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px', padding: '20px 12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={20} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Chat Support</p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Available 24/7</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {faqs.map((faq, idx) => (
              <button key={idx} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: idx < faqs.length - 1 ? '1px solid var(--color-border)' : 'none', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{faq}</span>
                <ChevronRight size={16} color="var(--color-text-tertiary)" />
              </button>
            ))}
          </div>
        </div>

        {/* Other */}
        <div>
          <div className="section-header">
            <h2 className="section-title">Other Resources</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>
              <FileText size={18} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>User Guide</span>
            </button>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Mail size={18} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>Email Support</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Help;
