import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, LogOut, ChevronRight } from 'lucide-react';
import MobileHeader from '../../components/navigation/MobileHeader';


import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user, profile } = useAuth();

  const name = profile?.full_name || 'Citizen';
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  const email = user?.email || '';
  const phone = profile?.mobile || 'Not provided';
  const joinedDate = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';
  const location = 'India';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <MobileHeader title="Profile" showNotifications />

      <div className="page-container" style={{ paddingTop: 'calc(var(--nav-height-mobile) + 16px)' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '24px' }}>
              {initials}
            </div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--color-primary)', border: '2px solid var(--color-bg)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <Edit2 size={12} />
            </button>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            {name}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Citizen of India
          </p>
        </div>

        {/* Info Cards */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <h2 className="section-title" style={{ fontSize: '13px', margin: 0, color: 'var(--color-text-secondary)' }}>Personal Information</h2>
          </div>
          
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Mail size={18} color="var(--color-text-tertiary)" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>Email</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{email}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Phone size={18} color="var(--color-text-tertiary)" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>Mobile</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{phone}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={18} color="var(--color-text-tertiary)" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>Location</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{location}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Calendar size={18} color="var(--color-text-tertiary)" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>Joined</p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
          <button onClick={() => navigate('/settings')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--color-border)', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Account Settings</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </button>
          <button onClick={() => navigate('/help')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>Help & Support</span>
            <ChevronRight size={16} color="var(--color-text-tertiary)" />
          </button>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'var(--color-error-bg)', color: 'var(--color-error-text)', border: '1px solid var(--color-error-border)', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );
};

export default Profile;
