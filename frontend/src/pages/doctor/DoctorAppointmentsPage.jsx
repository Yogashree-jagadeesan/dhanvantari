import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppointmentCard, PageHeader, Modal, EmptyState } from '../../components/UI';

export default function DoctorAppointmentsPage({ onApprove, onReject, onComplete }) {
  const { appointments } = useAuth();
  const appts = appointments.doctor;
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
        title="Appointments"
        subtitle="Review requests, approve sessions and manage your schedule."
      />

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {tabs.slice(1).map(t => (
          <span key={t.key} className={`badge badge-${t.key==='pending'?'pending':t.key==='approved'?'approved':'completed'}`}>
            {t.count} {t.label}
          </span>
        ))}
      </div>

      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${filter === t.key ? 'active' : ''}`} onClick={() => setFilter(t.key)}>
            {t.label}{t.count > 0 && <span style={{ fontSize: 11, background: 'var(--bg)', borderRadius: 10, padding: '1px 7px', marginLeft: 4, color: 'var(--text-light)', fontWeight: 700 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="📅" title="No appointments in this category" desc="New booking requests from patients will appear here." />
      ) : (
        shown.map(appt => (
          <AppointmentCard key={appt.id} appt={appt} role="doctor" onApprove={onApprove} onReject={onReject} onComplete={onComplete} />
        ))
      )}
    </div>
  );
}
