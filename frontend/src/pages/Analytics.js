import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../utils/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, txnRes] = await Promise.all([
          API.get('/transactions/summary'),
          API.get('/transactions/?limit=50'),
        ]);
        setSummary(summaryRes.data);
        setTransactions(txnRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Pie chart data
  const pieData = summary ? [
    { name: 'Deposited', value: summary.total_deposited },
    { name: 'Sent', value: summary.total_sent },
    { name: 'Received', value: summary.total_received },
  ].filter(d => d.value > 0) : [];

  const PIE_COLORS = ['#6366f1', '#ff6b6b', '#22c55e'];

  // Bar chart — last 7 days activity
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const dateStr = date.toISOString().split('T')[0];

      const dayTxns = transactions.filter(t => t.timestamp?.startsWith(dateStr));
      const deposited = dayTxns.filter(t => t.transaction_type === 'deposit').reduce((s, t) => s + t.amount, 0);
      const sent = dayTxns.filter(t => t.transaction_type === 'transfer').reduce((s, t) => s + t.amount, 0);

      days.push({ label, deposited, sent });
    }
    return days;
  };

  const barData = getLast7Days();

  // Most active day
  const mostActiveDay = barData.reduce((max, d) => (d.deposited + d.sent > max.deposited + max.sent ? d : max), barData[0]);

  // Success rate
  const successCount = transactions.filter(t => t.status === 'success').length;
  const successRate = transactions.length > 0 ? ((successCount / transactions.length) * 100).toFixed(0) : 0;

  // Avg transaction
  const avgTxn = transactions.length > 0
    ? (transactions.reduce((s, t) => s + t.amount, 0) / transactions.length).toFixed(0)
    : 0;

  if (loading) return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#666', fontSize: '18px' }}>Loading analytics...</p>
      </div>
    </div>
  );

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>Spending Analytics 📊</h1>
        <p style={styles.subtitle}>Your complete wallet activity breakdown</p>

        {/* Stats Row */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Transactions', value: summary?.total_transactions || 0, icon: '🔄', color: '#6366f1' },
            { label: 'Success Rate', value: `${successRate}%`, icon: '✅', color: '#22c55e' },
            { label: 'Avg Transaction', value: `₹${parseInt(avgTxn).toLocaleString('en-IN')}`, icon: '📊', color: '#f59e0b' },
            { label: 'Current Balance', value: `₹${summary?.current_balance?.toLocaleString('en-IN') || 0}`, icon: '💳', color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statIcon}>{stat.icon}</div>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.chartsGrid}>
          {/* Pie Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>💰 Money Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#aaa', fontSize: '13px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={styles.noData}>No transaction data yet</p>
            )}

            {/* Legend with amounts */}
            <div style={styles.legendGrid}>
              {[
                { label: 'Deposited', value: summary?.total_deposited, color: '#6366f1' },
                { label: 'Sent', value: summary?.total_sent, color: '#ff6b6b' },
                { label: 'Received', value: summary?.total_received, color: '#22c55e' },
              ].map((item, i) => (
                <div key={i} style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: item.color }} />
                  <div>
                    <div style={styles.legendLabel}>{item.label}</div>
                    <div style={{ ...styles.legendValue, color: item.color }}>
                      ₹{(item.value || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>📅 Last 7 Days Activity</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" stroke="#555" fontSize={11} />
                <YAxis stroke="#555" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name === 'deposited' ? 'Deposited' : 'Sent']}
                />
                <Bar dataKey="deposited" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sent" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {mostActiveDay && (mostActiveDay.deposited + mostActiveDay.sent > 0) && (
              <div style={styles.insightBox}>
                <span style={styles.insightIcon}>💡</span>
                <span style={styles.insightText}>
                  Most active day: <strong style={{ color: '#8b5cf6' }}>{mostActiveDay.label}</strong> with ₹{(mostActiveDay.deposited + mostActiveDay.sent).toLocaleString('en-IN')} in activity
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Type Breakdown */}
        <div style={styles.breakdownCard}>
          <h3 style={styles.cardTitle}>🔍 Transaction Type Breakdown</h3>
          <div style={styles.breakdownGrid}>
            {[
              { type: 'Deposits', count: transactions.filter(t => t.transaction_type === 'deposit').length, icon: '📥', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
              { type: 'Transfers Sent', count: transactions.filter(t => t.transaction_type === 'transfer').length, icon: '📤', color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
              { type: 'Transfers Received', count: transactions.filter(t => t.transaction_type === 'received').length, icon: '📨', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
              { type: 'Flagged', count: transactions.filter(t => t.status === 'flagged').length, icon: '🚨', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            ].map((item, i) => (
              <div key={i} style={{ ...styles.breakdownItem, background: item.bg, border: `1px solid ${item.color}30` }}>
                <span style={styles.breakdownIcon}>{item.icon}</span>
                <div style={{ ...styles.breakdownCount, color: item.color }}>{item.count}</div>
                <div style={styles.breakdownType}>{item.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', fontFamily: "'Segoe UI', sans-serif" },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  title: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '28px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { fontSize: '22px', fontWeight: '700', marginBottom: '4px' },
  statLabel: { color: '#666', fontSize: '12px' },
  chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  chartCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' },
  cardTitle: { color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 20px' },
  noData: { color: '#666', textAlign: 'center', padding: '60px 0' },
  legendGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  legendLabel: { color: '#888', fontSize: '11px' },
  legendValue: { fontSize: '14px', fontWeight: '700', marginTop: '2px' },
  insightBox: { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', padding: '12px', marginTop: '16px' },
  insightIcon: { fontSize: '18px' },
  insightText: { color: '#aaa', fontSize: '13px' },
  breakdownCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' },
  breakdownGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '8px' },
  breakdownItem: { borderRadius: '14px', padding: '20px', textAlign: 'center' },
  breakdownIcon: { fontSize: '28px', display: 'block', marginBottom: '8px' },
  breakdownCount: { fontSize: '32px', fontWeight: '800', marginBottom: '4px' },
  breakdownType: { color: '#888', fontSize: '12px' },
};