import { useState } from 'react';

const MOCK_DOCTORS = [
  { id: 1, full_name: 'Dr. Priya Sharma',   specialty: 'General Physician', experience: 12, fee: 499, status: 'approved',  email: 'priya@demo.com',  phone: '+91-9811223344' },
  { id: 2, full_name: 'Dr. Arjun Mehta',    specialty: 'Mental Health',     experience:  8, fee: 699, status: 'pending',   email: 'arjun@demo.com',  phone: '+91-9922334455' },
  { id: 3, full_name: 'Dr. Kavitha Rao',    specialty: 'Ayurveda',          experience: 15, fee: 399, status: 'approved',  email: 'kavitha@demo.com',phone: '+91-9733445566' },
  { id: 4, full_name: 'Dr. Rohit Bansal',   specialty: 'Dermatology',       experience:  5, fee: 599, status: 'rejected',  email: 'rohit@demo.com',  phone: '+91-9644556677' },
  { id: 5, full_name: 'Dr. Sneha Pillai',   specialty: 'Pediatrics',        experience:  9, fee: 549, status: 'pending',   email: 'sneha@demo.com',  phone: '+91-9555667788' },
];

const MOCK_PATIENTS = [
  { id: 1, full_name: 'Rahul Sharma',  gender: 'Male',   age: 32, phone: '+91-9876543210', email: 'patient@demo.com', appointments: 4 },
  { id: 2, full_name: 'Anjali Tiwari', gender: 'Female', age: 27, phone: '+91-9765432109', email: 'anjali@demo.com',  appointments: 2 },
  { id: 3, full_name: 'Vikram Singh',  gender: 'Male',   age: 45, phone: '+91-9654321098', email: 'vikram@demo.com',  appointments: 7 },
];

const MOCK_APPOINTMENTS = [
  { id: 1, patient: 'Rahul Sharma',  doctor: 'Dr. Priya Sharma',  date: '2026-04-02', time: '10:00', status: 'approved',  fee: 499 },
  { id: 2, patient: 'Anjali Tiwari', doctor: 'Dr. Kavitha Rao',   date: '2026-04-03', time: '11:30', status: 'pending',   fee: 399 },
  { id: 3, patient: 'Vikram Singh',  doctor: 'Dr. Arjun Mehta',   date: '2026-03-28', time: '15:00', status: 'completed', fee: 699 },
  { id: 4, patient: 'Rahul Sharma',  doctor: 'Dr. Sneha Pillai',  date: '2026-04-05', time: '09:30', status: 'pending',   fee: 549 },
];

const STATUS_COLORS = {
  approved:  { bg: 'rgba(20,184,166,.12)', color: '#0d9488', label: '✅ Approved'  },
  pending:   { bg: 'rgba(245,158,11,.12)', color: '#d97706', label: '⏳ Pending'   },
  rejected:  { bg: 'rgba(239,68,68,.12)',  color: '#dc2626', label: '❌ Rejected'  },
  completed: { bg: 'rgba(59,130,246,.12)', color: '#2563eb', label: '✔ Completed' },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab]         = useState('overview');
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [patients]            = useState(MOCK_PATIENTS);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [toast, setToast]     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const updateDoctorStatus = (id, status) => {
    setDoctors(d => d.map(doc => doc.id === id ? { ...doc, status } : doc));
    showToast(status === 'approved' ? '✅ Doctor approved successfully!' : '❌ Doctor rejected.');
  };

  const deleteDoctor = (id) => {
    if (!window.confirm('Remove this doctor permanently?')) return;
    setDoctors(d => d.filter(doc => doc.id !== id));
    showToast('🗑️ Doctor removed.');
  };

  const stats = [
    { icon: '🩺', label: 'Total Doctors',      value: doctors.length,                         color: 'var(--blue)'   },
    { icon: '👥', label: 'Total Patients',      value: patients.length,                        color: 'var(--teal)'   },
    { icon: '📅', label: 'Total Appointments',  value: MOCK_APPOINTMENTS.length,               color: 'var(--purple)' },
    { icon: '⏳', label: 'Pending Approvals',   value: doctors.filter(d => d.status === 'pending').length, color: 'var(--amber)'  },
  ];

  const TABS = ['overview', 'doctors', 'patients', 'appointments', 'settings'];

  return (
    <div style={{ fontFamily: 'var(--font)', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Admin Navbar */}
      <nav style={{ background: '#18181b', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 200, boxShadow: '0 2px 12px rgba(0,0,0,.3)' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>
          Dhan<span style={{ color: '#a78bfa' }}>vantari</span>
          <span style={{ marginLeft: 10, fontSize: 11, background: 'rgba(167,139,250,.2)', color: '#a78bfa', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? 'rgba(167,139,250,.2)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(255,255,255,.55)', border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: tab === t ? 700 : 500, fontSize: 13, textTransform: 'capitalize' }}>
              {t === 'overview' ? '📊 Overview' : t === 'doctors' ? '🩺 Doctors' : t === 'patients' ? '👥 Patients' : t === 'appointments' ? '📅 Appointments' : '⚙️ Settings'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13 }}>🛡️ Admin</span>
          <button onClick={onLogout} style={{ background: 'rgba(220,38,38,.15)', color: '#fca5a5', border: '1px solid rgba(220,38,38,.3)', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Sign Out</button>
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#18181b', color: '#fff', borderRadius: 12, padding: '12px 20px', fontWeight: 600, fontSize: 14, zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,.4)' }}>
          {toast}
        </div>
      )}

      <div className="page-wrapper fade-in">
        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900 }}>Admin Dashboard</h1>
              <p style={{ color: 'var(--text-mid)', marginTop: 4 }}>Manage the Dhanvantari platform from one place.</p>
            </div>
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div>
                    <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending doctors quick list */}
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>⏳ Pending Doctor Approvals</h2>
              {doctors.filter(d => d.status === 'pending').length === 0 ? (
                <p style={{ color: 'var(--text-light)', fontSize: 14 }}>All doctors reviewed. Nothing pending.</p>
              ) : doctors.filter(d => d.status === 'pending').map(doc => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{doc.full_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{doc.specialty} · {doc.experience} yrs · ₹{doc.fee}/session</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={() => updateDoctorStatus(doc.id, 'approved')}>✅ Approve</button>
                    <button className="btn btn-danger btn-sm"  onClick={() => updateDoctorStatus(doc.id, 'rejected')}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent appointments */}
            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📅 Recent Appointments</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)' }}>
                      {['Patient','Doctor','Date','Time','Status','Fee'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-light)', letterSpacing: .5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_APPOINTMENTS.map(a => (
                      <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>{a.patient}</td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-mid)' }}>{a.doctor}</td>
                        <td style={{ padding: '10px 14px' }}>{a.date}</td>
                        <td style={{ padding: '10px 14px' }}>{a.time}</td>
                        <td style={{ padding: '10px 14px' }}><Badge status={a.status} /></td>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--teal)' }}>₹{a.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── DOCTORS ── */}
        {tab === 'doctors' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 900 }}>Manage Doctors</h1>
                <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>{doctors.length} doctors registered</p>
              </div>
            </div>
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Name','Specialty','Exp.','Fee','Status','Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-light)', letterSpacing: .5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{doc.full_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{doc.email}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-mid)' }}>{doc.specialty}</td>
                      <td style={{ padding: '12px 14px' }}>{doc.experience} yrs</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>₹{doc.fee}</td>
                      <td style={{ padding: '12px 14px' }}><Badge status={doc.status} /></td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {doc.status === 'pending' && <>
                            <button className="btn btn-success btn-sm" onClick={() => updateDoctorStatus(doc.id, 'approved')}>✅</button>
                            <button className="btn btn-danger btn-sm"  onClick={() => updateDoctorStatus(doc.id, 'rejected')}>❌</button>
                          </>}
                          {doc.status === 'approved' && (
                            <button className="btn btn-ghost btn-sm" onClick={() => updateDoctorStatus(doc.id, 'rejected')}>Suspend</button>
                          )}
                          {doc.status === 'rejected' && (
                            <button className="btn btn-outline btn-sm" onClick={() => updateDoctorStatus(doc.id, 'approved')}>Restore</button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(doc.id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PATIENTS ── */}
        {tab === 'patients' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900 }}>Manage Patients</h1>
              <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>{patients.length} patients registered</p>
            </div>
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Name','Gender','Age','Phone','Email','Appointments','Actions'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-light)', letterSpacing: .5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>{p.full_name}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-mid)' }}>{p.gender}</td>
                      <td style={{ padding: '12px 14px' }}>{p.age}</td>
                      <td style={{ padding: '12px 14px' }}>{p.phone}</td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-light)', fontSize: 13 }}>{p.email}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--teal)' }}>{p.appointments}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => showToast('🗑️ Patient removed.')}>🗑️ Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── APPOINTMENTS ── */}
        {tab === 'appointments' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900 }}>All Appointments</h1>
              <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>Monitor all consultations on the platform</p>
            </div>
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['#','Patient','Doctor','Date','Time','Status','Fee'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 12, color: 'var(--text-light)', letterSpacing: .5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_APPOINTMENTS.map(a => (
                    <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', color: 'var(--text-light)', fontWeight: 600 }}>#{a.id}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{a.patient}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-mid)' }}>{a.doctor}</td>
                      <td style={{ padding: '10px 14px' }}>{a.date}</td>
                      <td style={{ padding: '10px 14px' }}>{a.time}</td>
                      <td style={{ padding: '10px 14px' }}><Badge status={a.status} /></td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--teal)' }}>₹{a.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900 }}>Platform Settings</h1>
              <p style={{ color: 'var(--text-mid)', fontSize: 14 }}>Control global Dhanvantari platform settings</p>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>🌐 Maintenance Mode</h2>
              <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 20 }}>
                When enabled, patients and doctors cannot access the platform. Only admins can log in.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div onClick={() => { setMaintenanceMode(m => !m); showToast(maintenanceMode ? '✅ Site is live!' : '🔧 Maintenance mode ON'); }}
                  style={{ width: 52, height: 28, borderRadius: 14, background: maintenanceMode ? '#dc2626' : '#16a34a', cursor: 'pointer', position: 'relative', transition: 'background .3s' }}>
                  <div style={{ position: 'absolute', top: 4, left: maintenanceMode ? 28 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .3s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                </div>
                <span style={{ fontWeight: 700, color: maintenanceMode ? '#dc2626' : '#16a34a' }}>
                  {maintenanceMode ? '🔧 Maintenance Mode — Site is DOWN' : '✅ Site is Live'}
                </span>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📧 Platform Info</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['Platform Name','Dhanvantari'],['Support Email','support@dhanvantari.in'],['Version','1.0.0'],['Environment','Production']].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>🗄️ Database Health</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {['users','doctor_profiles','patient_profiles','appointments','prescriptions'].map(t => (
                  <span key={t} style={{ background: 'rgba(20,184,166,.1)', color: 'var(--teal)', borderRadius: 8, padding: '4px 12px', fontSize: 13, fontWeight: 600 }}>✅ {t}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
