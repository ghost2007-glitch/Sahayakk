import React, { useState } from 'react';
import { Bell, Shield, Lock, Globe, Moon } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';

const Settings: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <div 
      onClick={() => onChange(!checked)}
      style={{
        width: '40px', height: '22px', borderRadius: '11px', 
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        position: 'relative', cursor: 'pointer', transition: 'background-color 200ms ease'
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '2px', left: checked ? '20px' : '2px',
        transition: 'left 200ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </div>
  );

  return (
    <>
      <MobileHeader title="Settings" showBack showNotifications={false} />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        
        {/* Notifications */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title">Notifications</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Bell size={18} color="var(--color-text-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Push Notifications</span>
              </div>
              <Toggle checked={pushEnabled} onChange={setPushEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Bell size={18} color="var(--color-text-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Email Alerts</span>
              </div>
              <Toggle checked={emailEnabled} onChange={setEmailEnabled} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Bell size={18} color="var(--color-text-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>SMS Alerts</span>
              </div>
              <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title">Preferences</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Globe size={18} color="var(--color-text-secondary)" />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Language</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>English (India)</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Moon size={18} color="var(--color-text-secondary)" />
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Dark Mode</span>
              </div>
              <Toggle checked={darkMode} onChange={setDarkMode} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div style={{ marginBottom: '24px' }}>
          <div className="section-header">
            <h2 className="section-title">Security & Privacy</h2>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>
              <Lock size={18} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Change Password</span>
            </button>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Shield size={18} color="var(--color-text-secondary)" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Privacy Policy</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Settings;
