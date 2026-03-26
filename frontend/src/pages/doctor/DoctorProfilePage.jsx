import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, PageHeader } from '../../components/UI';
import { SPECIALTIES } from '../../context/AuthContext';

export default function DoctorProfilePage() {
  const { auth } = useAuth();
  const profile = auth.profile;
  const initials = profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [form, setForm] = useState({
    bio: 'Expert in preventive care and chronic disease management.',
    consultation_fee: profile.consultation_fee || 499,
    google_meet_link: profile.google_meet_link || '',
    available_from: '09:00',
    available_to: '18:00',
    phone: profile.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-wrapper fade-in">
      <PageHeader title="My Profile" subtitle="Manage your professional information and settings." />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Profile card */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
              <Avatar initials={initials} color="#2563eb" size={64} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.full_name}</div>
                <div style={{ color: 'var(--blue)', fontWeight: 700, fontSize: 13 }}>{profile.specialty_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>⭐ {profile.rating_avg} · {profile.rating_count} reviews</div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Experience',   profile.experience_years + ' years'],
                ['Fee',          '₹' + profile.consultation_fee],
                ['Status',       profile.is_approved ? '✅ Approved' : '⏳ Pending Review'],
                ['Specialty',    profile.specialty_name],
              ].map(([k, v]) => (
                <div key={k} style={{ fontSize: 13 }}>
                  <div style={{ color: 'var(--text-light)', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Account info */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Account Info</h3>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Email', 'doctor@demo.com'],['Member since','March 2026'],['Last login','Today']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings form */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18 }}>⚙️ Profile Settings</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation Fee (₹)</label>
              <input className="form-input" type="number" min="100" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Google Meet Link</label>
              <input className="form-input" placeholder="https://meet.google.com/your-code" value={form.google_meet_link} onChange={e => set('google_meet_link', e.target.value)} />
              <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                ⓘ This link is automatically shared with patients when you approve their appointment.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label className="form-label">Available From</label>
                <input className="form-input" type="time" value={form.available_from} onChange={e => set('available_from', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Available To</label>
                <input className="form-input" type="time" value={form.available_to} onChange={e => set('available_to', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Bio / About Me</label>
              <textarea className="form-input form-textarea" placeholder="Describe your expertise…" value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>

            {saved && <div className="alert alert-success">✅ Profile saved successfully!</div>}
            <button type="submit" className="btn btn-secondary btn-full btn-lg">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
