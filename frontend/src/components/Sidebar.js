import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
  { icon: '💰', label: 'Deposit', path: '/deposit' },
  { icon: '📤', label: 'Transfer', path: '/transfer' },
  { icon: '📜', label: 'Transactions', path: '/transactions' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <span style={styles.brandIcon}>💳</span>
        <span style={styles.brandName}>NeoWallet</span>
      </div>

      <div style={styles.userInfo}>
        <div style={styles.avatar}>{user?.full_name?.[0]?.toUpperCase()}</div>
        <div>
          <div style={styles.userName}>{user?.full_name}</div>
          <div style={styles.userEmail}>{user?.email}</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.path}
            style={location.pathname === item.path ? styles.navItemActive : styles.navItem}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '260px', minHeight: '100vh', background: 'rgba(255,255,255,0.03)',
    borderRight: '1px solid rgba(255,255,255,0.08)', padding: '24px 16px',
    display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif",
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '32px' },
  brandIcon: { fontSize: '28px' },
  brandName: { color: '#fff', fontSize: '20px', fontWeight: '700' },
  userInfo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'rgba(255,255,255,0.05)', borderRadius: '14px',
    padding: '14px', marginBottom: '32px',
  },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: '700', fontSize: '16px', flexShrink: 0,
  },
  userName: { color: '#fff', fontWeight: '600', fontSize: '14px' },
  userEmail: { color: '#666', fontSize: '12px', marginTop: '2px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px',
    background: 'transparent', border: 'none', borderRadius: '12px',
    color: '#888', fontSize: '15px', cursor: 'pointer', textAlign: 'left', width: '100%',
  },
  navItemActive: {
    display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px',
    color: '#fff', fontSize: '15px', cursor: 'pointer', textAlign: 'left', width: '100%', fontWeight: '600',
  },
  navIcon: { fontSize: '18px' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px',
    background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)',
    borderRadius: '12px', color: '#ff6b6b', fontSize: '15px', cursor: 'pointer',
    marginTop: '16px', width: '100%',
  },
};
