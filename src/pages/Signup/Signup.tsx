import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LatticeLoader from '../../components/loading/LatticeLoader';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone) errs.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter a valid Indian mobile number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreed) errs.terms = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.name,
            phone: form.phone,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setApiError('This email is already registered.');
        } else {
          setApiError(error.message);
        }
      } else {
        // Successful signup
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      setApiError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-logo">
            <img src="/logo.png" alt="Sahayak" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-success-text)' }}>Account Created Successfully!</h1>
          <LatticeLoader status="done" label="Success" />
          <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Sahayak" />
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '6px' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '28px' }}>
          Start accessing government services online
        </p>

        {apiError && (
          <div style={{ background: 'var(--color-error-bg)', color: 'var(--color-error-text)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid var(--color-error-border)' }}>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label required" htmlFor="name">Full name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="name"
                  type="text"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  placeholder="Rajan Mehta"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label required" htmlFor="email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label required" htmlFor="phone">Mobile number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="phone"
                  type="tel"
                  className={`form-input${errors.phone ? ' error' : ''}`}
                  placeholder="98765 43210"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label required" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => updateField('password', e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '44px' }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label required" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  style={{ paddingLeft: '38px', paddingRight: '44px' }}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            {/* Terms */}
            <div>
              <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => {
                    setAgreed(e.target.checked);
                    if (errors.terms) setErrors(er => ({ ...er, terms: '' }));
                  }}
                  style={{ marginTop: '2px', flexShrink: 0, accentColor: 'var(--color-primary)' }}
                />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  I agree to the <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Privacy Policy</a>
                </span>
              </label>
              {errors.terms && <span className="form-error" style={{ marginTop: '4px', display: 'block' }}>{errors.terms}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LatticeLoader status="working" label="Creating Account" pattern="orbit" grid={3} shape="round" cellSize={4} gap={2} fontSize={14} />
                </div>
              ) : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
