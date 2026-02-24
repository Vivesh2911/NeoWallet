import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';

const filters = ['all', 'deposit', 'transfer', 'received'];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTxns = async () => {
      setLoading(true);
      try {
        const url = filter === 'all' ? '/transactions/?limit=50' : `/transactions/?transaction_type=${filter}&limit=50`;
        const res = await API.get(url);
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTxns();
  }, [filter]);

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>Transaction History 📜</h1>

        {/* Filter Tabs */}
        <div style={styles.filterRow}>
          {filters.map(f => (
            <button key={f} style={filter === f ? styles.filterActive : styles.filter}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.card}>
          {loading ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No transactions found.</p>
          ) : (
            transactions.map(txn => (
              <div key={txn.id} style={styles.txnRow}>
                <div style={styles.txnIconWrap}>
                  <span style={styles.txnIcon}>
                    {txn.transaction_type === 'deposit' ? '📥' : txn.transaction_type === 'transfer' ? '📤' : '📨'}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.txnType}>
                    {txn.transaction_type?.charAt(0).toUpperCase() + txn.transaction_type?.slice(1)}
                  </div>
                  <div style={styles.txnDesc}>{txn.description || '—'}</div>
                  <div style={styles.txnDate}>{new Date(txn.timestamp).toLocaleString('en-IN')}</div>
                </div>
                <div style={styles.right}>
                  <div style={{ ...styles.txnAmount, color: txn.transaction_type === 'transfer' ? '#ff6b6b' : '#22c55e' }}>
                    {txn.transaction_type === 'transfer' ? '-' : '+'}₹{txn.amount?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ ...styles.statusBadge, background: txn.status === 'success' ? 'rgba(34,197,94,0.15)' : txn.status === 'flagged' ? 'rgba(251,191,36,0.15)' : 'rgba(255,107,107,0.15)', color: txn.status === 'success' ? '#22c55e' : txn.status === 'flagged' ? '#fbbf24' : '#ff6b6b' }}>
                    {txn.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: '32px' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 24px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '24px' },
  filter: { padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#888', fontSize: '14px', cursor: 'pointer' },
  filterActive: { padding: '10px 20px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '20px', color: '#8b5cf6', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '8px 24px' },
  txnRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  txnIconWrap: { width: '44px', height: '44px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txnIcon: { fontSize: '20px' },
  txnType: { color: '#fff', fontWeight: '600', fontSize: '14px' },
  txnDesc: { color: '#666', fontSize: '12px', marginTop: '2px' },
  txnDate: { color: '#555', fontSize: '11px', marginTop: '2px' },
  right: { textAlign: 'right' },
  txnAmount: { fontWeight: '700', fontSize: '16px' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', marginTop: '4px' },
};
