import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';
import { allServices } from '../../data/services';

interface FormData {
  fullName: string;
  aadhaar: string;
  dob: string;
  mobile: string;
  address: string;
  purpose: string;
}

const RequestForm: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    fullName: '',
    aadhaar: '',
    dob: '',
    mobile: '',
    address: '',
    purpose: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const service = allServices.find(s => s.id === serviceId);
  const totalSteps = 3;

  const validateStep1 = () => {
    const errs: Partial<FormData> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.aadhaar.trim()) errs.aadhaar = 'Aadhaar number is required';
    else if (!/^\d{12}$/.test(form.aadhaar.replace(/\s/g, ''))) errs.aadhaar = 'Enter a valid 12-digit Aadhaar number';
    if (!form.dob) errs.dob = 'Date of birth is required';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, ''))) errs.mobile = 'Enter a valid mobile number';
    return errs;
  };

  const validateStep2 = () => {
    const errs: Partial<FormData> = {};
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.purpose.trim()) errs.purpose = 'Purpose is required';
    return errs;
  };

  const handleNext = () => {
    let errs = {};
    if (step === 1) errs = validateStep1();
    else if (step === 2) errs = validateStep2();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    navigate(`/services/${serviceId}/processing`);
  };

  const update = (field: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const mockUpload = () => {
    const names = ['Aadhaar_Card.pdf', 'Address_Proof.jpg', 'Photo.jpg'];
    const remaining = names.filter(n => !uploadedFiles.includes(n));
    if (remaining.length > 0) {
      setUploadedFiles(f => [...f, remaining[0]]);
    }
  };

  return (
    <>
      <MobileHeader title={service?.name || 'Application'} showBack showNotifications={false} />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        {/* Progress */}
        <div className="progress-steps" style={{ marginBottom: '28px' }}>
          {['Personal Details', 'Address', 'Documents'].map((label, i) => {
            const stepNum = i + 1;
            const isComplete = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={i} className={`progress-step${isComplete ? ' completed' : isActive ? ' active' : ''}`}>
                <div className="progress-step-circle">
                  {isComplete ? '✓' : stepNum}
                </div>
                <span className="progress-step-label" style={{ display: window.innerWidth > 400 ? 'block' : 'none' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="section-title">Personal Details</h2>

            <div className="form-group">
              <label className="form-label required" htmlFor="fullName">Full Name (as per Aadhaar)</label>
              <input
                id="fullName"
                type="text"
                className={`form-input${errors.fullName ? ' error' : ''}`}
                placeholder="Rajan Kumar Mehta"
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                autoComplete="name"
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="aadhaar">Aadhaar Number</label>
              <input
                id="aadhaar"
                type="text"
                className={`form-input${errors.aadhaar ? ' error' : ''}`}
                placeholder="XXXX XXXX XXXX"
                value={form.aadhaar}
                onChange={e => update('aadhaar', e.target.value.replace(/[^\d\s]/g, '').slice(0, 14))}
                inputMode="numeric"
              />
              <span className="form-helper">12-digit Aadhaar card number</span>
              {errors.aadhaar && <span className="form-error">{errors.aadhaar}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="dob">Date of Birth</label>
              <input
                id="dob"
                type="date"
                className={`form-input${errors.dob ? ' error' : ''}`}
                value={form.dob}
                onChange={e => update('dob', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && <span className="form-error">{errors.dob}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                type="tel"
                className={`form-input${errors.mobile ? ' error' : ''}`}
                placeholder="98765 43210"
                value={form.mobile}
                onChange={e => update('mobile', e.target.value)}
                inputMode="numeric"
                autoComplete="tel"
              />
              {errors.mobile && <span className="form-error">{errors.mobile}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="section-title">Address & Purpose</h2>

            <div className="form-group">
              <label className="form-label required" htmlFor="address">Current Address</label>
              <textarea
                id="address"
                className={`form-input form-textarea${errors.address ? ' error' : ''}`}
                placeholder="House No., Street, Area, City, State, PIN"
                value={form.address}
                onChange={e => update('address', e.target.value)}
                rows={4}
                style={{ minHeight: '100px' }}
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="purpose">Purpose of Application</label>
              <select
                id="purpose"
                className={`form-input form-select${errors.purpose ? ' error' : ''}`}
                value={form.purpose}
                onChange={e => update('purpose', e.target.value)}
              >
                <option value="">Select purpose</option>
                <option value="bank-account">Bank Account Opening</option>
                <option value="scholarship">Scholarship Application</option>
                <option value="loan">Loan Application</option>
                <option value="govt-scheme">Government Scheme</option>
                <option value="other">Other</option>
              </select>
              {errors.purpose && <span className="form-error">{errors.purpose}</span>}
            </div>

            <div className="card" style={{ background: 'var(--color-info-bg)', borderColor: 'var(--color-info-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-info-text)', lineHeight: 1.5 }}>
                <strong>Note:</strong> Ensure your address matches the one on your Aadhaar card or provide a valid address proof document.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="section-title">Upload Documents</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Upload the required documents in PDF, JPG, or PNG format (max 5MB each).
            </p>

            {/* Required docs list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Aadhaar Card', 'Address Proof', 'Passport-size Photo'].map(doc => {
                const uploadedFileName = uploadedFiles.find(f => f.toLowerCase().includes(doc.split(' ')[0].toLowerCase()));
                return (
                  <div key={doc} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: 'var(--color-surface)',
                    border: `1px solid ${uploadedFileName ? 'var(--color-success-border)' : 'var(--color-border)'}`,
                    borderRadius: '8px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{doc}</p>
                      {uploadedFileName && (
                        <p style={{ fontSize: '12px', color: 'var(--color-success-text)', marginTop: '2px' }}>
                          ✓ {uploadedFileName}
                        </p>
                      )}
                    </div>
                    {uploadedFileName ? (
                      <button
                        onClick={() => setUploadedFiles(f => f.filter(file => file !== uploadedFileName))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}
                        aria-label={`Remove ${doc}`}
                      >
                        <X size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={mockUpload}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          background: 'none', border: '1px solid var(--color-primary)',
                          borderRadius: '6px', padding: '6px 10px',
                          fontSize: '12px', color: 'var(--color-primary)', fontWeight: 500, cursor: 'pointer',
                        }}
                      >
                        <Upload size={13} />
                        Upload
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="card" style={{ background: 'var(--color-warning-bg)', borderColor: 'var(--color-warning-border)' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-warning-text)', lineHeight: 1.5 }}>
                All documents must be clearly legible. Blurry or incomplete documents may delay your application.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
          {step > 1 && (
            <button
              className="btn btn-secondary"
              onClick={() => setStep(s => s - 1)}
              style={{ flex: 1 }}
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ flex: 1 }}
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              style={{ flex: 1 }}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RequestForm;
