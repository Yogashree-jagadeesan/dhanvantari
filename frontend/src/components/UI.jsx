import { useState } from 'react';

// ── Navbar ─────────────────────────────────────────────────────────────────
export function Navbar({ role, name, onLogout, onNavigate, activePage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const patientLinks = [
    { key: 'home',         label: '🏠 Home'         },
    { key: 'find-doctors', label: '🔍 Find Doctors'  },
    { key: 'appointments', label: '📅 Appointments'  },
    { key: 'records',      label: '📋 Records'       },
    { key: 'payments',     label: '💳 Payments'      },
  ];
  const doctorLinks = [
    { key: 'home',         label: '🏠 Home'          },
    { key: 'appointments', label: '📅 Appointments'  },
    { key: 'schedule',     label: '📆 Schedule'      },
    { key: 'profile',      label: '⚙️ My Profile'    },
  ];
  const links = role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <nav style={{
      background: role === 'doctor' ? '#1e3a5f' : '#0f172a',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 64,
      position: 'sticky', top: 0, zIndex: 200,
      boxShadow: '0 2px 12px rgba(0,0,0,.2)',
    }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
        Dhan<span style={{ color: role === 'doctor' ? '#60a5fa' : '#14b8a6' }}>vantari</span>
        {role === 'doctor' && (
          <span style={{ marginLeft: 8, fontSize: 11, background: 'rgba(96,165,250,.2)', color: '#60a5fa', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>
            DOCTOR
          </span>
        )}
      </div>

      {/* Desktop links */}
      <div className="hide-mobile" style={{ display: 'flex', gap: 4 }}>
        {links.map(l => (
          <button key={l.key}
            onClick={() => onNavigate(l.key)}
            style={{
              background: activePage === l.key ? 'rgba(255,255,255,.1)' : 'transparent',
              color: activePage === l.key ? '#fff' : 'rgba(255,255,255,.6)',
              border: 'none', padding: '8px 14px', borderRadius: 8,
              cursor: 'pointer', fontWeight: activePage === l.key ? 700 : 500, fontSize: 13,
              transition: 'all .2s',
            }}>
            {l.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>
          {role === 'doctor' ? '🩺' : '👤'} {name}
        </span>
        <button
          onClick={onLogout}
          style={{ background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:   { cls: 'badge-pending',   label: '⏳ Pending'    },
  approved:  { cls: 'badge-approved',  label: '✅ Approved'   },
  rejected:  { cls: 'badge-rejected',  label: '❌ Rejected'   },
  completed: { cls: 'badge-completed', label: '✔ Completed'  },
  cancelled: { cls: 'badge-busy',      label: '🚫 Cancelled'  },
  no_show:   { cls: 'badge-rejected',  label: '👻 No Show'    },
};
export function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

// ── Avatar ────────────────────────────────────────────────────────────────
export function Avatar({ initials, color = '#0d9488', size = 48 }) {
  return (
    <div className="avatar" style={{
      width: size, height: size,
      background: color + '22', color,
      fontSize: size * 0.34, fontWeight: 800,
      border: `2px solid ${color}44`,
    }}>
      {initials}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 520 }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      zIndex: 500, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1rem',
    }}>
      <div className="card fade-in" style={{ maxWidth: width, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-light)' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── StepBar ───────────────────────────────────────────────────────────────
export function StepBar({ steps, current }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ flex: 1 }}>
          <div style={{ height: 4, borderRadius: 4, background: current > i ? 'var(--teal)' : current === i ? 'var(--teal-mid)' : 'var(--border)', transition: 'background .3s' }} />
          <div style={{ fontSize: 11, color: current >= i ? 'var(--teal)' : 'var(--text-light)', marginTop: 4, fontWeight: current >= i ? 700 : 400 }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--text-light)', marginTop: 6, marginBottom: action ? 20 : 0 }}>{desc}</div>
      {action}
    </div>
  );
}

// ── AppointmentCard ───────────────────────────────────────────────────────
export function AppointmentCard({ appt, role, onApprove, onReject, onComplete }) {
  const typeIcon = appt.consult_type === 'video' ? '📹' : appt.consult_type === 'audio' ? '📞' : '💬';

  return (
    <div className="card slide-in" style={{ marginBottom: 14, borderLeft: `4px solid ${appt.status === 'pending' ? 'var(--amber)' : appt.status === 'approved' ? 'var(--teal)' : appt.status === 'completed' ? 'var(--blue)' : 'var(--border)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            {role === 'patient' ? appt.doctor_name : `👤 ${appt.patient_name}`}
            {role === 'doctor' && appt.patient_age && <span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-light)', marginLeft: 8 }}>Age {appt.patient_age}</span>}
          </div>
          {role === 'patient' && <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{appt.specialty}</div>}
          <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>📅 {appt.appointment_date}</span>
            <span>⏰ {appt.appointment_time}</span>
            <span>{typeIcon} {appt.consult_type}</span>
            <span>₹{appt.fee_charged}</span>
          </div>
          {appt.symptoms && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-mid)', background: 'var(--bg)', borderRadius: 6, padding: '6px 10px' }}>
              📋 {appt.symptoms}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <StatusBadge status={appt.status} />

          {/* Patient actions */}
          {role === 'patient' && appt.status === 'approved' && appt.google_meet_url && (
            <a href={appt.google_meet_url} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
              📹 Join Google Meet
            </a>
          )}

          {/* Doctor actions */}
          {role === 'doctor' && appt.status === 'pending' && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-success btn-sm" onClick={() => onApprove(appt.id)}>✅ Approve</button>
              <button className="btn btn-danger btn-sm" onClick={() => onReject(appt.id)}>❌ Reject</button>
            </div>
          )}
          {role === 'doctor' && appt.status === 'approved' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {appt.google_meet_url && (
                <a href={appt.google_meet_url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                  📹 Open Meet
                </a>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => onComplete(appt.id)}>✔ Complete</button>
            </div>
          )}
        </div>
      </div>

      {/* Meet link banner */}
      {appt.status === 'approved' && appt.google_meet_url && (
        <div style={{ marginTop: 12, background: 'var(--teal-light)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--teal-dark)' }}>
          🔗 Meet link: <a href={appt.google_meet_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)', fontWeight: 700 }}>{appt.google_meet_url}</a>
        </div>
      )}
    </div>
  );
}
