import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LatticeLoader from '../../components/loading/LatticeLoader';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
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
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setApiError('Please confirm your email before signing in. (Or disable email confirmation in your Supabase Auth settings).');
        } else {
          setApiError(error.message);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setApiError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/logo.png" alt="Sahayak" />
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '6px' }}>
          Sign in to Sahayak
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '28px' }}>
          Access your civic services dashboard
        </p>

        {apiError && (
          <div style={{ background: 'var(--color-error-bg)', color: 'var(--color-error-text)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid var(--color-error-border)' }}>
            {apiError === 'Invalid login credentials' ? 'Invalid email or password.' : apiError}
            {apiError.includes('confirm your email') && (
              <div style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.resend({ type: 'signup', email: form.email });
                    setApiError('Confirmation email resent. Please check your inbox.');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '13px', textDecoration: 'underline' }}
                >
                  Resend confirmation email
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label required" htmlFor="email">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => {
                    setForm(f => ({ ...f, email: e.target.value }));
                    if (errors.email) setErrors(er => ({ ...er, email: '' }));
                  }}
                  style={{ paddingLeft: '38px' }}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && <span id="email-error" className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label required" htmlFor="password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => {
                    setForm(f => ({ ...f, password: e.target.value }));
                    if (errors.password) setErrors(er => ({ ...er, password: '' }));
                  }}
                  style={{ paddingLeft: '38px', paddingRight: '44px' }}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span id="password-error" className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '4px', position: 'relative' }} disabled={isLoading}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LatticeLoader status="working" label="Signing in" pattern="orbit" grid={3} shape="round" cellSize={4} gap={2} fontSize={14} />
                </div>
              ) : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="divider" />

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
