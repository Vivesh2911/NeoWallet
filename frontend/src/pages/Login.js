import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login({
        full_name: res.data.full_name,
        email: res.data.email,
        user_id: res.data.user_id,
        wallet_balance: res.data.wallet_balance,
      }, res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>💳</div>
        <h1 style={styles.title}>NeoWallet</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkText}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logo: { fontSize: '48px', textAlign: 'center', marginBottom: '8px' },
  title: { color: '#fff', textAlign: 'center', fontSize: '28px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: '32px', fontSize: '14px' },
  error: { background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '8px', fontWeight: '500' },
  input: {
    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '15px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer', marginTop: '8px',
  },
  btnDisabled: {
    width: '100%', padding: '15px', background: '#444',
    border: 'none', borderRadius: '12px', color: '#888', fontSize: '16px',
    fontWeight: '600', cursor: 'not-allowed', marginTop: '8px',
  },
  link: { color: '#888', textAlign: 'center', marginTop: '24px', fontSize: '14px' },
  linkText: { color: '#8b5cf6', textDecoration: 'none', fontWeight: '600' },
};
