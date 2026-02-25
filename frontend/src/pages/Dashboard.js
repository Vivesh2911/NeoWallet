import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
//import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, updateBalance } = useAuth();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, txnRes, balRes] = await Promise.all([
          API.get('/transactions/summary'),
          API.get('/transactions/?limit=5'),
          API.get('/wallet/balance'),
        ]);
        setSummary(summaryRes.data);
        setTransactions(txnRes.data);
        updateBalance(balRes.data.wallet_balance);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = transactions.slice().reverse().reduce((acc, t) => {
  const prev = acc.length > 0 ? acc[acc.length - 1].balance : 0;
  const balance = t.transaction_type === 'transfer'
    ? prev - t.amount
    : prev + t.amount;
  acc.push({
    name: new Date(t.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    balance: parseFloat(balance.toFixed(2)),
    amount: t.amount,
  });
  return acc;
}, []);

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
            <p style={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Balance Card */}
        <div style={styles.balanceCard}>
          <div>
            <p style={styles.balanceLabel}>Total Wallet Balance</p>
            <h2 style={styles.balanceAmount}>₹{user?.wallet_balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div style={styles.balanceIcon}>💳</div>
        </div>

        {/* Stats */}
        {summary && (
          <div style={styles.statsGrid}>
            {[
              { label: 'Total Deposited', value: `₹${summary.total_deposited?.toLocaleString('en-IN')}`, icon: '📥', color: '#22c55e' },
              { label: 'Total Sent', value: `₹${summary.total_sent?.toLocaleString('en-IN')}`, icon: '📤', color: '#f59e0b' },
              { label: 'Total Received', value: `₹${summary.total_received?.toLocaleString('en-IN')}`, icon: '📨', color: '#6366f1' },
              { label: 'Transactions', value: summary.total_transactions, icon: '🔄', color: '#ec4899' },
            ].map((stat, i) => (
              <div key={i} style={styles.statCard}>
                <div style={{ ...styles.statIcon, color: stat.color }}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
  <div style={styles.chartCard}>
    <h3 style={styles.sectionTitle}>📈 Balance History</h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData}>
        <XAxis dataKey="name" stroke="#555" fontSize={12} />
        <YAxis stroke="#555" fontSize={12} tickFormatter={(v) => `₹${v}`} />
        <Tooltip
          contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Balance']}
        />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          dot={{ fill: '#8b5cf6', r: 4 }}
          activeDot={{ r: 6, fill: '#a855f7' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

        {/* Recent Transactions */}
        <div style={styles.txnCard}>
          <h3 style={styles.sectionTitle}>Recent Transactions</h3>
          {loading ? <p style={{ color: '#666' }}>Loading...</p> : transactions.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '32px' }}>No transactions yet. Make a deposit to get started!</p>
          ) : (
            transactions.map(txn => (
              <div key={txn.id} style={styles.txnRow}>
                <div style={styles.txnIcon}>
                  {txn.transaction_type === 'deposit' ? '📥' : txn.transaction_type === 'transfer' ? '📤' : '📨'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={styles.txnType}>{txn.transaction_type?.charAt(0).toUpperCase() + txn.transaction_type?.slice(1)}</div>
                  <div style={styles.txnDate}>{new Date(txn.timestamp).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ ...styles.txnAmount, color: txn.transaction_type === 'transfer' ? '#ff6b6b' : '#22c55e' }}>
                  {txn.transaction_type === 'transfer' ? '-' : '+'}₹{txn.amount?.toLocaleString('en-IN')}
                </div>
                <div style={{ ...styles.txnStatus, background: txn.status === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(255,107,107,0.15)', color: txn.status === 'success' ? '#22c55e' : '#ff6b6b' }}>
                  {txn.status}
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
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  greeting: { color: '#fff', fontSize: '26px', fontWeight: '700', margin: 0 },
  date: { color: '#666', fontSize: '14px', marginTop: '4px' },
  balanceCard: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
    borderRadius: '20px', padding: '32px', marginBottom: '24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 20px 40px rgba(99,102,241,0.3)',
  },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0 0 8px' },
  balanceAmount: { color: '#fff', fontSize: '40px', fontWeight: '800', margin: 0 },
  balanceIcon: { fontSize: '64px', opacity: 0.5 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '20px', textAlign: 'center',
  },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '4px' },
  statLabel: { color: '#666', fontSize: '12px' },
  chartCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '24px', marginBottom: '24px',
  },
  txnCard: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '24px',
  },
  sectionTitle: { color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px' },
  txnRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  txnIcon: { fontSize: '24px', width: '40px', textAlign: 'center' },
  txnType: { color: '#fff', fontWeight: '600', fontSize: '14px' },
  txnDate: { color: '#666', fontSize: '12px', marginTop: '2px' },
  txnAmount: { fontWeight: '700', fontSize: '16px' },
  txnStatus: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
};
