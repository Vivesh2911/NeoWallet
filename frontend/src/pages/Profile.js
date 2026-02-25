import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: '', phone_number: '' });
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/me');
        setProfile(res.data);
        setEditForm({ full_name: res.data.full_name, phone_number: res.data.phone_number || '' });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await API.put('/user/me', editForm);
      toast.success('Profile updated successfully!');
      const token = localStorage.getItem('token');
      const updatedUser = { ...user, full_name: res.data.full_name };
      login(updatedUser, token);
      setProfile(prev => ({ ...prev, full_name: res.data.full_name, phone_number: res.data.phone_number }));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    }
    setEditLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.new_password !== passForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      await API.put('/user/me/password', {
        current_password: passForm.current_password,
        new_password: passForm.new_password,
      });
      toast.success('Password changed successfully!');
      setPassForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Password change failed');
    }
    setPassLoading(false);
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>My Profile 👤</h1>

        {profile && (
          <div style={styles.profileCard}>
            <div style={styles.avatarLarge}>
              {profile.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={styles.profileName}>{profile.full_name}</h2>
              <p style={styles.profileEmail}>{profile.email}</p>
              <p style={styles.profileJoined}>
                Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={styles.balancePill}>
              💳 ₹{profile.wallet_balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}

        <div style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>✏️ Edit Profile</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} type="text" value={editForm.full_name}
                  onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input style={{ ...styles.input, opacity: 0.5, cursor: 'not-allowed' }}
                  type="email" value={profile?.email || ''} disabled />
                <small style={styles.hint}>Email cannot be changed</small>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input style={styles.input} type="text" placeholder="+91 9999999999"
                  value={editForm.phone_number}
                  onChange={e => setEditForm({ ...editForm, phone_number: e.target.value })} />
              </div>
              <button style={editLoading ? styles.btnDisabled : styles.btn} disabled={editLoading}>
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🔒 Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Current Password</label>
                <input style={styles.input} type="password" placeholder="••••••••"
                  value={passForm.current_password}
                  onChange={e => setPassForm({ ...passForm, current_password: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>New Password</label>
                <input style={styles.input} type="password" placeholder="••••••••"
                  value={passForm.new_password}
                  onChange={e => setPassForm({ ...passForm, new_password: e.target.value })} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm New Password</label>
                <input style={styles.input} type="password" placeholder="••••••••"
                  value={passForm.confirm_password}
                  onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })} required />
              </div>
              <button style={passLoading ? styles.btnDisabled : styles.btnSecondary} disabled={passLoading}>
                {passLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: '32px' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 24px' },
  profileCard: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px',
    padding: '28px', marginBottom: '28px',
    display: 'flex', alignItems: 'center', gap: '24px',
  },
  avatarLarge: {
    width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '800', fontSize: '28px',
  },
  profileName: { color: '#fff', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' },
  profileEmail: { color: '#aaa', fontSize: '14px', margin: '0 0 4px' },
  profileJoined: { color: '#666', fontSize: '12px', margin: 0 },
  balancePill: {
    marginLeft: 'auto', background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px',
    padding: '10px 20px', color: '#8b5cf6', fontWeight: '700', fontSize: '16px',
    whiteSpace: 'nowrap',
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  card: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px', padding: '28px',
  },
  cardTitle: { color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 24px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '8px', fontWeight: '500' },
  hint: { color: '#555', fontSize: '11px', marginTop: '4px', display: 'block' },
  input: {
    width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { width: '100%', padding: '14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', color: '#8b5cf6', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '14px', background: '#333', border: 'none', borderRadius: '12px', color: '#666', fontSize: '15px', cursor: 'not-allowed' },
};