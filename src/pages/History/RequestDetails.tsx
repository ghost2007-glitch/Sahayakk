import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, HelpCircle, ChevronRight, File } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import StatusBadge from '../../components/feedback/StatusBadge';
import { mockActivity } from '../../data/mockActivity';
import { allServices } from '../../data/services';

const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const activity = mockActivity.find(a => a.id === id);
  const service = activity ? allServices.find(s => s.id === activity.serviceId) : null;

  if (!activity) {
    return (
      <>
        <MobileHeader title="Request Details" showBack />
        <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
          <div className="empty-state">
            <p className="empty-state-title">Request not found</p>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/activity')}>
              Back to Activity
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Request Details" showBack showNotifications={false} />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        
        {/* Header card */}
        <div className="card" style={{ marginBottom: '16px', borderTop: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {activity.service}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Ref: <span style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{activity.requestId}</span>
              </p>
            </div>
            <StatusBadge status={activity.status} />
          </div>

          <div className="divider" style={{ margin: '12px 0' }} />

          <div className="grid-2">
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Submitted On</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Expected By</p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {activity.status === 'completed' ? '-' : (service?.estimatedTime || 'N/A')}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <h2 className="section-title" style={{ fontSize: '15px', marginBottom: '16px' }}>Status Timeline</h2>
          
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute',
              top: '12px',
              bottom: '24px',
              left: '7px',
              width: '2px',
              background: 'var(--color-border)',
              zIndex: 0
            }} />

            {/* Steps */}
            {[
              { status: 'Submitted', desc: 'Application received', date: activity.date, done: true },
              { status: 'Document Verification', desc: 'Checking uploaded documents', date: activity.date, done: true },
              { status: 'Processing', desc: 'At relevant department', date: activity.status !== 'pending' ? activity.date : null, done: activity.status !== 'pending' },
              { status: 'Completed', desc: 'Certificate generated', date: activity.status === 'completed' ? activity.date : null, done: activity.status === 'completed' },
            ].map((step, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: i === 3 ? 0 : '24px', zIndex: 1 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: step.done ? 'var(--color-primary)' : 'var(--color-surface)',
                  border: `2px solid ${step.done ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  boxShadow: '0 0 0 4px var(--color-surface)'
                }} />
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '14px', fontWeight: step.done ? 600 : 400, color: step.done ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', marginBottom: '2px' }}>
                      {step.status}
                    </p>
                    {step.date && (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                        {new Date(step.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="section-title" style={{ fontSize: '15px', marginBottom: '16px' }}>Uploaded Documents</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Aadhaar_Card.pdf', 'Address_Proof.jpg', 'Application_Form.pdf'].map(doc => (
              <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <File size={16} color="var(--color-text-secondary)" />
                <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-primary)' }}>{doc}</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', padding: '4px' }}>
                  <Download size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activity.status === 'completed' && (
            <button className="btn btn-primary btn-full">
              <Download size={16} />
              Download Output Document
            </button>
          )}
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/assistant')}>
            <HelpCircle size={16} />
            Need Help with this Request?
          </button>
        </div>

      </div>
    </>
  );
};

export default RequestDetails;
