import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const quickAmounts = [500, 1000, 2000, 5000, 10000];

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { user, updateBalance } = useAuth();

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/wallet/deposit', { amount: parseFloat(amount) });
      setSuccess(res.data.message);
      updateBalance(res.data.new_balance);
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Deposit failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>Add Money 💰</h1>
        <p style={styles.subtitle}>Current Balance: <span style={styles.balance}>₹{user?.wallet_balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>

        <div style={styles.card}>
          {success && <div style={styles.success}>{success} 🎉</div>}
          {error && <div style={styles.error}>{error}</div>}

          <p style={styles.label}>Quick Add</p>
          <div style={styles.quickGrid}>
            {quickAmounts.map(amt => (
              <button key={amt} style={amount === String(amt) ? styles.quickBtnActive : styles.quickBtn}
                onClick={() => setAmount(String(amt))}>
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <form onSubmit={handleDeposit}>
            <div style={styles.field}>
              <label style={styles.label}>Or enter custom amount</label>
              <div style={styles.inputWrapper}>
                <span style={styles.rupee}>₹</span>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
            <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
              {loading ? 'Processing...' : `Deposit ₹${amount || '0'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: '32px', maxWidth: '600px' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { color: '#888', marginBottom: '32px', fontSize: '15px' },
  balance: { color: '#8b5cf6', fontWeight: '700' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' },
  success: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '15px' },
  error: { background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '15px' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' },
  quickBtn: { padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#aaa', fontSize: '14px', cursor: 'pointer' },
  quickBtnActive: { padding: '12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.5)', borderRadius: '10px', color: '#8b5cf6', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  field: { marginBottom: '20px' },
  label: { color: '#aaa', fontSize: '13px', marginBottom: '10px', fontWeight: '500', display: 'block' },
  inputWrapper: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' },
  rupee: { color: '#8b5cf6', fontSize: '20px', fontWeight: '700', padding: '0 16px' },
  input: { flex: 1, padding: '16px 16px 16px 0', background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', outline: 'none' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '16px', background: '#333', border: 'none', borderRadius: '12px', color: '#666', fontSize: '16px', fontWeight: '600', cursor: 'not-allowed' },
};
