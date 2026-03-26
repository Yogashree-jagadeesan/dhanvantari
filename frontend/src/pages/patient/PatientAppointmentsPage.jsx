import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppointmentCard, PageHeader, EmptyState } from '../../components/UI';

export default function PatientAppointmentsPage({ onNavigate }) {
  const { appointments } = useAuth();
  const appts = appointments.patient;
  const [filter, setFilter] = useState('all');

  const tabs = [
    { key: 'all',       label: 'All',       count: appts.length },
    { key: 'pending',   label: 'Pending',   count: appts.filter(a => a.status==='pending').length },
    { key: 'approved',  label: 'Approved',  count: appts.filter(a => a.status==='approved').length },
    { key: 'completed', label: 'Completed', count: appts.filter(a => a.status==='completed').length },
  ];

  const shown = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  return (
    <div className="page-wrapper fade-in">
      <PageHeader
        title="My Appointments"
        subtitle="Track all your past and upcoming consultations."
        action={<button className="btn btn-primary" onClick={() => onNavigate('find-doctors')}>+ Book New</button>}
      />

      {/* Filter tabs */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label} {t.count > 0 && <span style={{ fontSize: 11, background: filter===t.key ? 'var(--teal-light)':'var(--bg)', borderRadius: 10, padding: '1px 7px', marginLeft: 4, color: filter===t.key ? 'var(--teal)':'var(--text-light)', fontWeight: 700 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="📅" title="No appointments found" desc="Book a consultation with one of our specialist doctors." action={<button className="btn btn-primary btn-sm" onClick={() => onNavigate('find-doctors')}>Find a Doctor</button>} />
      ) : (
        shown.map(appt => (
          <AppointmentCard key={appt.id} appt={appt} role="patient" />
        ))
      )}
    </div>
  );
}
