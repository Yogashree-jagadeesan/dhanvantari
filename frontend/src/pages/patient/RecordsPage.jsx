import { PageHeader, EmptyState } from '../../components/UI';

const PRESCRIPTIONS = [
  { id: 'RX-001', doctor: 'Dr. Arjun Mehta', date: 'Mar 18, 2026', specialty: 'Mental Health', medicines: ['Alprazolam 0.5mg — once daily at night','Vitamin D3 60K — once weekly','Omega 3 — twice daily with meals'], notes: 'Follow up in 4 weeks. Avoid caffeine.' },
  { id: 'RX-002', doctor: 'Dr. Priya Sharma', date: 'Feb 10, 2026', specialty: 'General Physician', medicines: ['Paracetamol 500mg — 3 times a day','Cetirizine 10mg — once at bedtime'], notes: 'Drink plenty of fluids. Rest well.' },
];

export default function RecordsPage() {
  return (
    <div className="page-wrapper fade-in">
      <PageHeader title="Health Records" subtitle="Your prescriptions, lab reports and documents." />

      {/* Prescriptions */}
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14 }}>💊 Prescriptions</h2>
      {PRESCRIPTIONS.map(rx => (
        <div key={rx.id} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Prescription {rx.id}</div>
              <div style={{ fontSize: 13, color: 'var(--teal)', fontWeight: 600 }}>{rx.doctor} · {rx.specialty}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Issued: {rx.date}</div>
            </div>
            <button className="btn btn-outline btn-sm">⬇ Download PDF</button>
          </div>
          <div className="divider" />
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-mid)', marginBottom: 6 }}>MEDICINES</div>
            {rx.medicines.map((m, i) => (
              <div key={i} style={{ fontSize: 14, color: 'var(--text)', padding: '4px 0', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--teal)' }}>•</span> {m}
              </div>
            ))}
          </div>
          {rx.notes && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text-mid)' }}>
              📝 {rx.notes}
            </div>
          )}
        </div>
      ))}

      {/* Lab Reports */}
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: '28px 0 14px' }}>🧪 Lab Reports</h2>
      <EmptyState icon="🔬" title="No lab reports yet" desc="Your uploaded lab reports and scan results will appear here." action={
        <button className="btn btn-outline btn-sm">⬆ Upload Report</button>
      } />

      {/* Vaccinations */}
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: '28px 0 14px' }}>💉 Vaccinations</h2>
      <div className="card">
        {[['COVID-19 Booster','Jan 15, 2024','Completed'],['Influenza','Nov 8, 2023','Completed'],['Hepatitis B','Mar 2025','Due'],].map(([name,date,status]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{date}</div>
            </div>
            <span className={`badge ${status === 'Completed' ? 'badge-approved' : 'badge-pending'}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
