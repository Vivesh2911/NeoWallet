import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If no receipt data, redirect to dashboard
  if (!state) {
    navigate('/dashboard');
    return null;
  }

  const { type, amount, recipient, balance, description, timestamp } = state;

  const handlePrint = () => window.print();

  return (
    <div style={styles.page}>
      <div style={styles.card} id="receipt">

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>💳 NeoWallet</div>
          <div style={styles.receiptLabel}>TRANSACTION RECEIPT</div>
        </div>

        {/* Success Icon */}
        <div style={styles.successCircle}>
          <span style={styles.checkmark}>✓</span>
        </div>
        <h2 style={styles.successText}>Transaction Successful!</h2>
        <p style={styles.successSub}>Your transaction has been processed</p>

        {/* Amount */}
        <div style={styles.amountBox}>
          <p style={styles.amountLabel}>{type === 'deposit' ? 'Amount Deposited' : 'Amount Sent'}</p>
          <h1 style={styles.amount}>₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerCircleLeft} />
          <div style={styles.dividerLine} />
          <div style={styles.dividerCircleRight} />
        </div>

        {/* Details */}
        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Transaction Type</span>
            <span style={styles.detailValue}>{type?.charAt(0).toUpperCase() + type?.slice(1)}</span>
          </div>

          {recipient && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Sent To</span>
              <span style={styles.detailValue}>{recipient}</span>
            </div>
          )}

          {description && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Note</span>
              <span style={styles.detailValue}>{description}</span>
            </div>
          )}

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date & Time</span>
            <span style={styles.detailValue}>
              {new Date(timestamp || Date.now()).toLocaleString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status</span>
            <span style={styles.statusBadge}>✓ Success</span>
          </div>

          <div style={{ ...styles.detailRow, borderBottom: 'none' }}>
            <span style={styles.detailLabel}>Balance After</span>
            <span style={{ ...styles.detailValue, color: '#8b5cf6', fontWeight: '700' }}>
              ₹{parseFloat(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Thank you for using NeoWallet</p>
          <p style={styles.footerSub}>Keep this receipt for your records</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions} className="no-print">
        <button style={styles.printBtn} onClick={handlePrint}>🖨️ Print Receipt</button>
        <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>🏠 Back to Dashboard</button>
        <button style={styles.txnBtn} onClick={() => navigate('/transactions')}>📜 View All Transactions</button>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #receipt {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '32px', fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px', width: '100%', maxWidth: '480px',
    overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    padding: '20px 28px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { color: '#fff', fontWeight: '700', fontSize: '18px' },
  receiptLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '2px' },
  successCircle: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '32px auto 16px', boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
  },
  checkmark: { color: '#fff', fontSize: '32px', fontWeight: '700' },
  successText: { color: '#fff', textAlign: 'center', fontSize: '22px', fontWeight: '700', margin: '0 0 8px' },
  successSub: { color: '#888', textAlign: 'center', fontSize: '14px', margin: '0 0 24px' },
  amountBox: {
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.2)',
    margin: '0 28px 24px', borderRadius: '16px', padding: '20px', textAlign: 'center',
  },
  amountLabel: { color: '#888', fontSize: '13px', margin: '0 0 8px' },
  amount: { color: '#fff', fontSize: '36px', fontWeight: '800', margin: 0 },
  divider: {
    display: 'flex', alignItems: 'center',
    margin: '0 0 24px', position: 'relative',
  },
  dividerCircleLeft: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: '#0f0f1a', marginLeft: '-10px', flexShrink: 0,
  },
  dividerLine: { flex: 1, borderTop: '2px dashed rgba(255,255,255,0.1)' },
  dividerCircleRight: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: '#0f0f1a', marginRight: '-10px', flexShrink: 0,
  },
  details: { padding: '0 28px 8px' },
  detailRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  detailLabel: { color: '#666', fontSize: '13px' },
  detailValue: { color: '#fff', fontSize: '13px', fontWeight: '600', textAlign: 'right', maxWidth: '60%' },
  statusBadge: {
    background: 'rgba(34,197,94,0.15)', color: '#22c55e',
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
  },
  footer: {
    background: 'rgba(255,255,255,0.03)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '20px 28px', textAlign: 'center', marginTop: '16px',
  },
  footerText: { color: '#888', fontSize: '13px', margin: '0 0 4px' },
  footerSub: { color: '#555', fontSize: '11px', margin: 0 },
  actions: {
    display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center',
  },
  printBtn: {
    padding: '12px 20px', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
  },
  dashBtn: {
    padding: '12px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: '12px',
    color: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '600',
  },
  txnBtn: {
    padding: '12px 20px', background: 'rgba(99,102,241,0.15)',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px',
    color: '#8b5cf6', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
  },
};