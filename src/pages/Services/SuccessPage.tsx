import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Copy, Home, Clock } from 'lucide-react';
import { allServices } from '../../data/services';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = allServices.find(s => s.id === serviceId);

  const refId = `REQ-2026-${Math.random().toString().slice(2, 7)}`;

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        maxWidth: '380px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center',
      }}>
        {/* Success icon */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-success-bg)',
          border: '2px solid var(--color-success-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-success-text)',
        }}>
          <CheckCircle size={36} />
        </div>

        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            Application Submitted!
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Your {service?.name || 'application'} has been submitted successfully. You'll receive updates via SMS and email.
          </p>
        </div>

        {/* Reference ID */}
        <div style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'left',
        }}>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Reference Number
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
              {refId}
            </p>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', color: copied ? 'var(--color-success-text)' : 'var(--color-primary)',
                background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
              }}
              aria-label="Copy reference number"
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Estimated time */}
        {service?.estimatedTime && (
          <div style={{
            width: '100%',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            padding: '12px 14px',
            background: 'var(--color-info-bg)',
            border: '1px solid var(--color-info-border)',
            borderRadius: '8px',
            textAlign: 'left',
          }}>
            <Clock size={16} color="var(--color-info-text)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: 'var(--color-info-text)', lineHeight: 1.4 }}>
              Expected processing time: <strong>{service.estimatedTime}</strong>
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn btn-primary btn-full"
            onClick={() => navigate('/activity')}
          >
            Track Application
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => navigate('/dashboard')}
          >
            <Home size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
