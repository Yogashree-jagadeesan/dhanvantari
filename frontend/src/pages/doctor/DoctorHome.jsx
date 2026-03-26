import { useAuth } from '../../context/AuthContext';
import { StatusBadge, Avatar } from '../../components/UI';

export default function DoctorHome({ onNavigate, onApprove, onReject }) {
  const { auth, appointments } = useAuth();
  const profile = auth.profile;
  const appts   = appointments.doctor;

  const pending   = appts.filter(a => a.status === 'pending');
  const upcoming  = appts.filter(a => a.status === 'approved');
  const completed = appts.filter(a => a.status === 'completed');

  const initials = profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="page-wrapper fade-in">
      {/* Doctor greeting card */}
      <div className="card" style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e4d8c)', border: 'none', marginBottom: 28, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar initials={initials} color="#60a5fa" size={64} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Dr. {profile.full_name.replace('Dr. ','')}</div>
          <div style={{ color: '#93c5fd', fontSize: 14, marginTop: 2 }}>{profile.specialty_name} · {profile.experience_years} yrs experience</div>
          <div style={{ color: '#93c5fd', fontSize: 13, marginTop: 4 }}>⭐ {profile.rating_avg} ({profile.rating_count} reviews) · ₹{profile.consultation_fee}/session</div>
        </div>
        {!profile.is_approved && (
          <div style={{ marginLeft: 'auto', background: 'rgba(251,191,36,.15)', border: '1px solid rgba(251,191,36,.3)', borderRadius: 10, padding: '10px 16px', color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
            ⏳ Profile under review
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          ['⏳', pending.length,   'Pending Requests', '#d97706'],
          ['✅', upcoming.length,  'Upcoming',         '#16a34a'],
          ['✔', completed.length, 'Completed',        '#2563eb'],
          ['⭐', profile.rating_avg || '—', 'Rating',  '#7c3aed'],
        ].map(([icon, val, label, color]) => (
          <div key={label} className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div>
              <div className="stat-value" style={{ color }}>{val}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber)' }}>⏳ Pending Approval ({pending.length})</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('appointments')}>View All</button>
          </div>
          {pending.map(appt => (
            <div key={appt.id} className="card-sm" style={{ marginBottom: 10, borderLeft: '4px solid var(--amber)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>👤 {appt.patient_name} <span style={{ color: 'var(--text-light)', fontWeight: 400, fontSize: 13 }}>Age {appt.patient_age}</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 3 }}>📅 {appt.appointment_date} · ⏰ {appt.appointment_time} · {appt.consult_type}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 4, background: 'var(--bg)', borderRadius: 6, padding: '5px 8px' }}>📋 {appt.symptoms}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <button className="btn btn-success btn-sm" onClick={() => onApprove(appt.id)}>✅ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onReject(appt.id)}>❌ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Today's appointments */}
      {upcoming.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>✅ Approved Appointments</h2>
          {upcoming.map(appt => (
            <div key={appt.id} className="card-sm" style={{ marginBottom: 10, borderLeft: '4px solid var(--teal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>👤 {appt.patient_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 3 }}>📅 {appt.appointment_date} · ⏰ {appt.appointment_time} · {appt.consult_type}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusBadge status={appt.status} />
                  {appt.google_meet_url && (
                    <a href={appt.google_meet_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>📹 Open Meet</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && upcoming.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🩺</div>
          <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>All clear for now!</div>
          <div style={{ fontSize: 14, marginTop: 6 }}>No pending requests. Check back soon.</div>
        </div>
      )}
    </div>
  );
}
