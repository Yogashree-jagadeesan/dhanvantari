import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/globals.css';

// Pages — Auth
import LandingPage            from './pages/LandingPage';
import LoginPage              from './pages/auth/LoginPage';
import RegisterPatientPage    from './pages/auth/RegisterPatientPage';
import RegisterDoctorPage     from './pages/auth/RegisterDoctorPage';

// Pages — Patient
import PatientHome            from './pages/patient/PatientHome';
import FindDoctorsPage        from './pages/patient/FindDoctorsPage';
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage';
import RecordsPage            from './pages/patient/RecordsPage';
import PaymentPage            from './pages/patient/PaymentPage';

// Pages — Doctor
import DoctorHome             from './pages/doctor/DoctorHome';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import DoctorProfilePage      from './pages/doctor/DoctorProfilePage';
import DoctorSchedulePage     from './pages/doctor/DoctorSchedulePage';

// Pages — Admin
import AdminDashboard         from './pages/admin/AdminDashboard';

// Components
import { Navbar, Modal }      from './components/UI';

// ── Patient Wrapper ────────────────────────────────────────────────────────
function PatientLogoutWrapper() {
  const { auth, logout } = useAuth();
  const profile          = auth.profile;
  const [page, setPage]  = useState('home');

  return (
    <>
      <Navbar role="patient" name={profile.full_name} onLogout={logout} onNavigate={setPage} activePage={page} />
      {page === 'home'         && <PatientHome              onNavigate={setPage} />}
      {page === 'find-doctors' && <FindDoctorsPage          onNavigate={setPage} />}
      {page === 'appointments' && <PatientAppointmentsPage  onNavigate={setPage} />}
      {page === 'records'      && <RecordsPage />}
      {page === 'payments'     && <PaymentPage />}
    </>
  );
}

// ── Doctor Wrapper ─────────────────────────────────────────────────────────
function DoctorLogoutWrapper() {
  const { auth, logout, updateDoctorAppt } = useAuth();
  const profile = auth.profile;
  const [page, setPage]             = useState('home');
  const [rejectId, setRejectId]     = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [completeId, setCompleteId] = useState(null);
  const [notes, setNotes]           = useState('');

  const handleApprove = (id) => {
    const meetUrl = profile.google_meet_link || `https://meet.google.com/meet-${id}-session`;
    updateDoctorAppt(id, { status: 'approved', google_meet_url: meetUrl });
  };
  const handleReject = () => {
    updateDoctorAppt(rejectId, { status: 'rejected', rejection_reason: rejectReason });
    setRejectId(null); setRejectReason('');
  };
  const handleComplete = () => {
    updateDoctorAppt(completeId, { status: 'completed', doctor_notes: notes });
    setCompleteId(null); setNotes('');
  };
  const cp = {
    onApprove: handleApprove,
    onReject:  setRejectId,
    onComplete:(id) => { setCompleteId(id); setNotes(''); },
  };

  return (
    <>
      <Navbar role="doctor" name={profile.full_name} onLogout={logout} onNavigate={setPage} activePage={page} />
      {page === 'home'         && <DoctorHome             {...cp} onNavigate={setPage} />}
      {page === 'appointments' && <DoctorAppointmentsPage {...cp} />}
      {page === 'profile'      && <DoctorProfilePage />}
      {page === 'schedule'     && <DoctorSchedulePage />}

      {rejectId && (
        <Modal title="Reject Appointment" onClose={() => setRejectId(null)}>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', marginBottom: 16 }}>Provide a reason so the patient can reschedule.</p>
          <div className="form-group">
            <label className="form-label">Reason *</label>
            <textarea className="form-input form-textarea" placeholder="e.g. Fully booked, please choose another date." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setRejectId(null)}>Cancel</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReject}>Reject</button>
          </div>
        </Modal>
      )}

      {completeId && (
        <Modal title="Complete Appointment" onClose={() => setCompleteId(null)}>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', marginBottom: 16 }}>Add notes for the patient health record.</p>
          <div className="form-group">
            <label className="form-label">Doctor Notes</label>
            <textarea className="form-input form-textarea" placeholder="Diagnosis, advice, follow-up instructions…" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button className="btn btn-success btn-full btn-lg" onClick={handleComplete}>Mark as Completed</button>
        </Modal>
      )}
    </>
  );
}

// ── Admin Wrapper ──────────────────────────────────────────────────────────
function AdminWrapper() {
  const { logout } = useAuth();
  return <AdminDashboard onLogout={logout} />;
}

// ── Root Router ────────────────────────────────────────────────────────────
function Router() {
  const { auth }                    = useAuth();
  const [publicPage, setPublicPage] = useState('landing');

  if (auth) {
    if (auth.role === 'doctor')  return <DoctorLogoutWrapper />;
    if (auth.role === 'patient') return <PatientLogoutWrapper />;
    if (auth.role === 'admin')   return <AdminWrapper />;
  }

  return (
    <>
      {publicPage === 'landing'           && <LandingPage         onNavigate={setPublicPage} />}
      {publicPage === 'login'             && <LoginPage           onNavigate={setPublicPage} />}
      {publicPage === 'register-patient'  && <RegisterPatientPage onNavigate={setPublicPage} />}
      {publicPage === 'register-doctor'   && <RegisterDoctorPage  onNavigate={setPublicPage} />}
    </>
  );
}

// ── Entry ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
