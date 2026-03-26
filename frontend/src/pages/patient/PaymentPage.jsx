import { useState } from 'react';

const MOCK_PAYMENTS = [
  { id: 'PAY001', doctor: 'Dr. Priya Sharma',  specialty: 'General Physician', date: '2026-03-26', amount: 499, status: 'paid',    method: 'UPI' },
  { id: 'PAY002', doctor: 'Dr. Arjun Mehta',   specialty: 'Mental Health',     date: '2026-03-29', amount: 699, status: 'pending',  method: '—'   },
  { id: 'PAY003', doctor: 'Dr. Kavitha Nair',  specialty: 'Ayurveda',          date: '2026-03-18', amount: 449, status: 'paid',    method: 'Card' },
];

const PAYMENT_METHODS = [
  { id: 'upi',  icon: '📱', label: 'UPI',          sub: 'Pay via any UPI app'       },
  { id: 'card', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'nb',   icon: '🏦', label: 'Net Banking',  sub: 'All major banks supported'  },
];

export default function PaymentPage({ pendingAmount = 699, doctorName = 'Dr. Arjun Mehta', onBack }) {
  const [method, setMethod]   = useState('upi');
  const [upiId, setUpiId]     = useState('');
  const [paid, setPaid]       = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tab, setTab]         = useState('history'); // 'history' | 'pay'

  const handlePay = async () => {
    if (method === 'upi' && !upiId.trim()) return alert('Please enter your UPI ID.');
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setPaid(true);
  };

  const statusStyle = (s) =>
    s === 'paid'
      ? { bg: 'rgba(20,184,166,.12)', color: '#0d9488', label: '✅ Paid'    }
      : { bg: 'rgba(245,158,11,.12)', color: '#d97706', label: '⏳ Pending' };

  return (
    <div className="page-wrapper fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Payments</h1>
        <p style={{ color: 'var(--text-mid)', fontSize: 14, marginTop: 4 }}>Manage consultation payments securely.</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 4, marginBottom: 24, maxWidth: 360 }}>
        {[['history','📋 Payment History'],['pay','💳 Make Payment']].map(([k,l]) => (
          <button key={k} onClick={() => { setTab(k); setPaid(false); }}
            style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all .2s',
              background: tab === k ? 'var(--teal)' : 'transparent',
              color: tab === k ? '#fff' : 'var(--text-mid)',
              boxShadow: tab === k ? 'var(--shadow-sm)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── HISTORY ── */}
      {tab === 'history' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Transaction History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                {['ID','Doctor','Date','Method','Amount','Status'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-light)', letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYMENTS.map(p => {
                const s = statusStyle(p.status);
                return (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-light)' }}>{p.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700 }}>{p.doctor}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.specialty}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>{p.date}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-mid)' }}>{p.method}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--teal)', fontSize: 16 }}>₹{p.amount}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Total Paid</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--teal)' }}>₹{MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)}</span>
          </div>
        </div>
      )}

      {/* ── PAY ── */}
      {tab === 'pay' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {paid ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-mid)', marginBottom: 20 }}>
                ₹{pendingAmount} paid to <strong>{doctorName}</strong>. Your appointment is confirmed.
              </p>
              <div style={{ background: 'var(--teal-light)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--teal-dark)', marginBottom: 24 }}>
                Transaction ID: <strong>PAY{Date.now().toString().slice(-6)}</strong>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => { setPaid(false); setTab('history'); }}>View Payment History</button>
            </div>
          ) : (
            <div className="card">
              {/* Order summary */}
              <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 18, marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 600, marginBottom: 10 }}>ORDER SUMMARY</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-mid)' }}>Consultation with {doctorName}</span>
                  <span style={{ fontWeight: 700 }}>₹{pendingAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-mid)' }}>Platform fee</span>
                  <span style={{ fontWeight: 700 }}>₹0</span>
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800 }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: 20, color: 'var(--teal)' }}>₹{pendingAmount}</span>
                </div>
              </div>

              {/* Method selection */}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-light)', marginBottom: 12, letterSpacing: .5 }}>SELECT PAYMENT METHOD</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id} onClick={() => setMethod(m.id)}
                    style={{ border: `2px solid ${method === m.id ? 'var(--teal)' : 'var(--border)'}`, background: method === m.id ? 'var(--teal-light)' : '#fff', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .15s' }}>
                    <span style={{ fontSize: 24 }}>{m.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{m.sub}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${method === m.id ? 'var(--teal)' : 'var(--border)'}`, background: method === m.id ? 'var(--teal)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {method === m.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* UPI input */}
              {method === 'upi' && (
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input className="form-input" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>e.g. name@okicici, name@ybl, name@paytm</div>
                </div>
              )}

              {method === 'card' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-input" placeholder="MM / YY" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" placeholder="•••" maxLength={4} type="password" />
                    </div>
                  </div>
                </>
              )}

              {method === 'nb' && (
                <div className="form-group">
                  <label className="form-label">Select Bank</label>
                  <select className="form-input">
                    {['SBI','HDFC','ICICI','Axis','Kotak','Punjab National Bank','Bank of Baroda','Canara Bank'].map(b => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12, color: 'var(--text-light)' }}>
                🔒 256-bit SSL encrypted · Powered by Razorpay
              </div>

              <button className="btn btn-primary btn-full btn-lg" onClick={handlePay} disabled={processing}>
                {processing ? '⏳ Processing payment…' : `Pay ₹${pendingAmount} →`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
