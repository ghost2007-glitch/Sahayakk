import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LatticeLoader from '../../components/loading/LatticeLoader';

const Processing: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('done');
      setTimeout(() => {
        navigate(`/services/${serviceId}/success`);
      }, 1200);
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate, serviceId]);

  return (
    <div className="processing-page" style={{ minHeight: '100dvh' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '320px',
        margin: '0 auto',
      }}>
        <img src="/logo.png" alt="Sahayak" style={{ height: '28px', width: 'auto' }} />

        <LatticeLoader
          status={status}
          label="Processing your request"
          doneLabel="Done in"
          errorLabel="Failed after"
          pattern="orbit"
          grid={3}
          shape="round"
          doneColor="#22c55e"
          errorColor="#ef4444"
          cellSize={8}
          gap={3}
          fontSize={14}
          idleOpacity={0.15}
          glow={false}
          showTimer
        />

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            {status === 'working' ? 'Processing your request' : 'Request submitted!'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {status === 'working'
              ? 'Sahayak is working on your application. This may take a moment.'
              : 'Your application has been successfully submitted.'}
          </p>
        </div>

        {status === 'working' && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '16px',
            width: '100%',
            textAlign: 'left',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: '12px' }}>
              PROCESSING STEPS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Verifying your information',
                'Validating documents',
                'Submitting to government portal',
                'Generating reference number',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
                    flexShrink: 0,
                  }} />
                  <p style={{ fontSize: '13px', color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Processing;
