import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Transfer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ receiver_email: '', amount: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { user, updateBalance } = useAuth();

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await API.post('/wallet/transfer', {
        receiver_email: form.receiver_email,
        amount: parseFloat(form.amount),
        description: form.description,
      });
      navigate('/receipt', {
  state: {
    type: 'transfer',
    amount: form.amount,
    recipient: form.receiver_email,
    description: form.description,
    balance: res.data.new_balance,
    timestamp: new Date(),
  }
});
      updateBalance(res.data.new_balance);
      setForm({ receiver_email: '', amount: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Transfer failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>Send Money 📤</h1>
        <p style={styles.subtitle}>Available: <span style={styles.balance}>₹{user?.wallet_balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>

        <div style={styles.card}>
          {success && <div style={styles.success}>{success} 🎉</div>}
          {error && <div style={styles.error}>⚠️ {error}</div>}

          <form onSubmit={handleTransfer}>
            <div style={styles.field}>
              <label style={styles.label}>Recipient Email</label>
              <input style={styles.input} type="email" placeholder="friend@example.com"
                value={form.receiver_email} onChange={e => setForm({ ...form, receiver_email: e.target.value })} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Amount</label>
              <div style={styles.inputWrapper}>
                <span style={styles.rupee}>₹</span>
                <input style={styles.amountInput} type="number" placeholder="0.00"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} min="1" required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Note (optional)</label>
              <input style={styles.input} type="text" placeholder="Paying for dinner..."
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Preview */}
            {form.amount && (
              <div style={styles.preview}>
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Sending to</span>
                  <span style={styles.previewValue}>{form.receiver_email || '—'}</span>
                </div>
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Amount</span>
                  <span style={{ ...styles.previewValue, color: '#ff6b6b' }}>- ₹{parseFloat(form.amount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.previewRow}>
                  <span style={styles.previewLabel}>Balance after</span>
                  <span style={{ ...styles.previewValue, color: '#22c55e' }}>₹{(user?.wallet_balance - parseFloat(form.amount || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
              {loading ? 'Sending...' : 'Send Money'}
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
  success: { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '14px', borderRadius: '12px', marginBottom: '20px' },
  error: { background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: '#ff6b6b', padding: '14px', borderRadius: '12px', marginBottom: '20px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '8px', fontWeight: '500' },
  input: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  inputWrapper: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
  rupee: { color: '#8b5cf6', fontSize: '20px', fontWeight: '700', padding: '0 16px' },
  amountInput: { flex: 1, padding: '16px 16px 16px 0', background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', outline: 'none' },
  preview: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '20px' },
  previewRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  previewLabel: { color: '#666', fontSize: '13px' },
  previewValue: { color: '#fff', fontSize: '13px', fontWeight: '600' },
  btn: { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { width: '100%', padding: '16px', background: '#333', border: 'none', borderRadius: '12px', color: '#666', fontSize: '16px', cursor: 'not-allowed' },
};
