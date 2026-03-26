import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SPECIALTIES } from '../../context/AuthContext';

export default function RegisterDoctorPage({ onNavigate }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    specialty: 'General Physician', qualification: '', experience_years: '',
    consultation_fee: '', phone: '', bio: '', google_meet_link: '',
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
    if (!form.specialty || !form.qualification) return setError('Please fill all required fields.');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login({
      token: 'mock_doctor_new', role: 'doctor',
      profile: { id: 99, full_name: form.full_name, specialty_name: form.specialty, qualification: form.qualification, experience_years: parseInt(form.experience_years) || 0, consultation_fee: parseInt(form.consultation_fee) || 499, rating_avg: 0, rating_count: 0, google_meet_link: form.google_meet_link, is_approved: 0 },
    });
    setLoading(false);
  };

  const STEPS = ['Account Info', 'Professional Details'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#dbeafe 0%,#e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font)' }}>
      <div style={{ width: '100%', maxWidth: 520 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, fontWeight: 900 }}>Dhan<span style={{ color: 'var(--blue)' }}>vantari</span></div>
          </button>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>Join as a Doctor</h1>
            <p style={{ color: 'var(--text-mid)', fontSize: 14, marginTop: 4 }}>Set up your profile and start seeing patients online</p>
          </div>

          {/* Step bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 4, background: step > i ? 'var(--blue)' : step === i + 1 ? '#60a5fa' : 'var(--border)', transition: 'background .3s' }} />
                <div style={{ fontSize: 11, color: step >= i + 1 ? 'var(--blue)' : 'var(--text-light)', marginTop: 4, fontWeight: step >= i + 1 ? 700 : 400 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <div className="form-group">
                <label className="form-label">Full Name (with title) *</label>
                <input className="form-input" placeholder="Dr. Your Name" value={form.full_name} onChange={e => set('full_name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="doctor@hospital.com" value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm_password} onChange={e => set('confirm_password', e.target.value)} required />
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button type="submit" className="btn btn-secondary btn-full btn-lg">Next →</button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Specialty *</label>
                <select className="form-input form-select" value={form.specialty} onChange={e => set('specialty', e.target.value)}>
                  {SPECIALTIES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Qualifications *</label>
                <input className="form-input" placeholder="e.g. MBBS, MD, PhD" value={form.qualification} onChange={e => set('qualification', e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label className="form-label">Experience (years)</label>
                  <input className="form-input" type="number" min="0" max="60" placeholder="10" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input className="form-input" type="number" min="0" placeholder="499" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Google Meet Link</label>
                <input className="form-input" placeholder="https://meet.google.com/your-code" value={form.google_meet_link} onChange={e => set('google_meet_link', e.target.value)} />
                <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>This will be shared with patients when you approve appointments.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Short Bio</label>
                <textarea className="form-input form-textarea" placeholder="Describe your expertise and experience…" value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>

              <div style={{ background: 'var(--blue-light)', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: 'var(--blue)' }}>
                ⓘ Your profile will be reviewed by our admin team before going live. This usually takes 24-48 hours.
              </div>

              {error && <div className="alert alert-error">{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-secondary" style={{ flex: 2 }} disabled={loading}>{loading ? 'Submitting…' : 'Register & Continue ✓'}</button>
              </div>
            </form>
          )}

          <div className="divider" />
          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-mid)' }}>
            Already registered?{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Sign In</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <button onClick={() => onNavigate('register-patient')} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: 13 }}>Register as Patient instead</button>
          </div>
        </div>
      </div>
    </div>
  );
}
