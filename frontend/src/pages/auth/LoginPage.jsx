import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [role, setRole]         = useState('patient');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const DEMO = {
    patient: { email: 'patient@demo.com', password: 'Patient@123' },
    doctor:  { email: 'doctor@demo.com',  password: 'Doctor@123'  },
    admin:   { email: 'admin@demo.com',   password: 'Admin@123'   },
  };

  const fillDemo = () => {
    setEmail(DEMO[role].email);
    setPassword(DEMO[role].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const d = DEMO[role];
    if (email === d.email && password === d.password) {
      if (role === 'patient') {
        login({ token: 'mock_patient', role: 'patient', profile: { id: 1, full_name: 'Rahul Sharma', phone: '+91-9876543210', blood_group: 'O+' } });
      } else if (role === 'doctor') {
        login({ token: 'mock_doctor', role: 'doctor', profile: { id: 1, full_name: 'Dr. Priya Sharma', specialty_name: 'General Physician', experience_years: 12, consultation_fee: 499, rating_avg: 4.9, rating_count: 312, google_meet_link: 'https://meet.google.com/demo-priya', is_approved: 1 } });
      } else if (role === 'admin') {
        login({ token: 'mock_admin', role: 'admin', profile: { id: 0, full_name: 'Admin' } });
      }
    } else {
      setError('Invalid credentials. Use the demo button to auto-fill.');
    }
    setLoading(false);
  };

  const ROLES = [
    { key: 'patient', label: '👤 Patient', color: 'var(--teal)' },
    { key: 'doctor',  label: '🩺 Doctor',  color: 'var(--blue)' },
    { key: 'admin',   label: '🛡️ Admin',   color: '#7c3aed'     },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,var(--teal-light) 0%,#e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'var(--font)' }}>
      <div style={{ width: '100%', maxWidth: 440 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ fontSize: 30, fontWeight: 900 }}>Dhan<span style={{ color: 'var(--teal)' }}>vantari</span></div>
          </button>
          <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 4 }}>Dhanvantari · Online Healthcare Platform</div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>Welcome back</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-mid)', fontSize: 14, marginBottom: 22 }}>Sign in to your account</p>

          {/* Role Toggle — 3 roles */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 4, marginBottom: 22 }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => { setRole(r.key); setError(''); }}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s',
                  background: role === r.key ? r.color : 'transparent',
                  color: role === r.key ? '#fff' : 'var(--text-mid)',
                  boxShadow: role === r.key ? 'var(--shadow-sm)' : 'none',
                }}>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder={DEMO[role].email} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginBottom: 12 }} disabled={loading}>
              {loading ? 'Signing in…' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)} →`}
            </button>

            <button type="button" onClick={fillDemo} className="btn btn-ghost btn-full btn-sm" style={{ marginBottom: 16 }}>
              🪄 Auto-fill Demo Credentials
            </button>
          </form>

          <div className="divider" />

          {role !== 'admin' && (
            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-mid)' }}>
              Don't have an account?{' '}
              <button onClick={() => onNavigate(role === 'doctor' ? 'register-doctor' : 'register-patient')} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                Register here
              </button>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button onClick={() => onNavigate('landing')} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: 13 }}>← Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
