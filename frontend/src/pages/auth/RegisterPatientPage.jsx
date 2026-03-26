import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPatientPage({ onNavigate }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    phone: '', date_of_birth: '', gender: '', blood_group: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.full_name || !form.email || !form.password) return setError('Please fill all required fields.');
      if (form.password !== form.confirm_password) return setError('Passwords do not match.');
      if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    }
    setError(''); setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login({ token: 'mock_patient_new', role: 'patient', profile: { id: 99, full_name: form.full_name, phone: form.phone, blood_group: form.blood_group } });
    setLoading(false);
  };

  const inputStyle = { marginBottom: 0 };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,var(--teal-light) 0%,#e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font)' }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, fontWeight: 900 }}>Dhan<span style={{ color: 'var(--teal)' }}>vantari</span></div>
          </button>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Create Patient Account</h1>
            <p style={{ color: 'var(--text-mid)', fontSize: 14, marginTop: 4 }}>Join thousands of patients getting care online</p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {['Account Info', 'Personal Details'].map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 4, background: step > i ? 'var(--teal)' : step === i + 1 ? 'var(--teal-mid)' : 'var(--border)', transition: 'background .3s' }} />
                <div style={{ fontSize: 11, color: step >= i + 1 ? 'var(--teal)' : 'var(--text-light)', marginTop: 4, fontWeight: step >= i + 1 ? 700 : 400 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" style={inputStyle} placeholder="Your full name" value={form.full_name} onChange={e => set('full_name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" style={inputStyle} type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" style={inputStyle} type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" style={inputStyle} type="password" placeholder="Repeat password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} required />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-primary btn-full btn-lg">Next →</button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" style={inputStyle} placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select className="form-input form-select" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select className="form-input form-select" value={form.blood_group} onChange={e => set('blood_group', e.target.value)}>
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>{loading ? 'Creating Account…' : 'Create Account ✓'}</button>
              </div>
            </form>
          )}

          <div className="divider" />
          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-mid)' }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Sign In</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <button onClick={() => onNavigate('register-doctor')} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: 13 }}>Register as Doctor instead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
