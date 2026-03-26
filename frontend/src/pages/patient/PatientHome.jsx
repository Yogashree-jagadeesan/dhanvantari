import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/UI';

export default function PatientHome({ onNavigate }) {
  const { auth, appointments } = useAuth();
  const profile = auth.profile;
  const appts   = appointments.patient;

  const upcoming  = appts.filter(a => ['approved','pending'].includes(a.status));
  const completed = appts.filter(a => a.status === 'completed');
  const pending   = appts.filter(a => a.status === 'pending');

  return (
    <div className="page-wrapper fade-in">
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900 }}>
          Hello, {profile.full_name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-mid)', marginTop: 4 }}>Here's your health overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          ['📅', upcoming.length,  'Upcoming',         'var(--teal)'],
          ['⏳', pending.length,   'Awaiting Approval','var(--amber)'],
          ['✔', completed.length, 'Completed',        'var(--blue)'],
          ['💊', 2,                'Prescriptions',    'var(--purple)'],
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

      {/* Upcoming appointments */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Upcoming Appointments</h2>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate('appointments')}>View All</button>
        </div>

        {upcoming.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
            <div style={{ fontWeight: 600 }}>No upcoming appointments</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => onNavigate('find-doctors')}>Book Now</button>
          </div>
        ) : upcoming.map(appt => (
          <div key={appt.id} className="card-sm" style={{ marginBottom: 10, borderLeft: `4px solid ${appt.status === 'approved' ? 'var(--teal)' : 'var(--amber)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{appt.doctor_name}</div>
                <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{appt.specialty}</div>
                <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 3 }}>
                  📅 {appt.appointment_date} · ⏰ {appt.appointment_time} · {appt.consult_type === 'video' ? '📹' : '📞'} {appt.consult_type}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <StatusBadge status={appt.status} />
                {appt.status === 'approved' && appt.google_meet_url && (
                  <a href={appt.google_meet_url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                    📹 Join
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Quick Actions</h2>
        <div className="grid-3">
          {[
            { icon: '🔍', label: 'Find a Doctor',    sub: 'Browse all specialties',      action: 'find-doctors', color: 'var(--teal)' },
            { icon: '📋', label: 'Health Records',   sub: 'View reports & prescriptions', action: 'records',      color: 'var(--purple)' },
            { icon: '📅', label: 'All Appointments', sub: 'Track your bookings',          action: 'appointments', color: 'var(--blue)' },
          ].map(q => (
            <button key={q.label} onClick={() => onNavigate(q.action)}
              style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.4rem', textAlign: 'left', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{q.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{q.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>{q.sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
