import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, MessageCircle, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { allServices } from '../../data/services';

const getIcon = (iconName: string): React.FC<{ size?: number }> => {
  return (Icons as unknown as Record<string, React.FC<{ size?: number }>>)[iconName] || Icons.FileText;
};

const requirements: Record<string, string[]> = {
  'ration-card': ['Aadhaar Card of all family members', 'Address Proof (Electricity bill / Rent agreement)', 'Income Proof', 'Passport-size photographs'],
  'income-cert': ['Aadhaar Card', 'Ration Card or Address Proof', 'Recent salary slips (if employed)', 'Affidavit'],
  'electricity-bill': ['Consumer number', 'Registered mobile number', 'Payment method (UPI/Card/Net Banking)'],
  'driving-license': ['Valid existing DL', 'Aadhaar Card', 'Medical certificate (Form 1A)', 'Passport-size photographs'],
  'default': ['Aadhaar Card', 'Address Proof', 'Passport-size photographs', 'Additional documents as required'],
};

const steps: Record<string, string[]> = {
  'electricity-bill': ['Enter consumer number', 'Verify bill details', 'Choose payment method', 'Complete payment', 'Download receipt'],
  'income-cert': ['Fill application form', 'Upload required documents', 'Pay application fee', 'Track application', 'Collect certificate'],
  'default': ['Fill the application form', 'Upload required documents', 'Submit application', 'Track application status', 'Receive certificate/document'],
};

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = allServices.find(s => s.id === serviceId);

  if (!service) {
    return (
      <>
        <MobileHeader title="Service Details" showBack />
        <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
          <div className="empty-state">
            <p className="empty-state-title">Service not found</p>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/services')}>
              Browse Services
            </button>
          </div>
        </div>
      </>
    );
  }

  const Icon = getIcon(service.icon);
  const serviceRequirements = requirements[service.id] || requirements.default;
  const serviceSteps = steps[service.id] || steps.default;

  return (
    <>
      <MobileHeader title="" showBack showNotifications={false} />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        {/* Service header */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div className="service-icon" style={{ width: '56px', height: '56px', flexShrink: 0, borderRadius: '12px' }}>
            <Icon size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '6px', letterSpacing: '-0.01em' }}>
              {service.name}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {service.description}
            </p>
          </div>
        </div>

        {/* Info chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {service.estimatedTime && (
            <span className="badge badge-info" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Clock size={11} />
              {service.estimatedTime}
            </span>
          )}
          <span className={`badge ${service.isAvailable ? 'badge-success' : 'badge-neutral'}`} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <CheckCircle size={11} />
            {service.isAvailable ? 'Available' : 'Temporarily unavailable'}
          </span>
        </div>

        {/* Requirements */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <h2 className="section-title" style={{ fontSize: '15px', marginBottom: '14px' }}>
            Documents Required
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {serviceRequirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '11px', fontWeight: 600,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process steps */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="section-title" style={{ fontSize: '15px', marginBottom: '14px' }}>
            How It Works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {serviceSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: i === 0 ? 'var(--color-primary)' : 'var(--color-bg)',
                  border: `2px solid ${i === 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: i === 0 ? 'white' : 'var(--color-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '11px', fontWeight: 600,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', paddingTop: '2px', lineHeight: 1.4 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={() => navigate(`/services/${service.id}/request`)}
            disabled={!service.isAvailable}
          >
            <FileText size={18} />
            Start Application
          </button>
          <button
            className="btn btn-secondary btn-full"
            onClick={() => navigate('/assistant')}
          >
            <MessageCircle size={16} />
            Ask Assistant for Help
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
