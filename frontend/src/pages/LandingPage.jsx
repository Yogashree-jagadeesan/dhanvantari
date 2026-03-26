const FEATURES = [
  { icon: '🏥', title: 'All Specialties',    desc: 'General medicine, mental health, Ayurveda, dermatology & more.' },
  { icon: '📹', title: 'Video Consultation', desc: 'HD video calls with certified doctors from your home.' },
  { icon: '📅', title: 'Easy Booking',       desc: 'Book appointments in under 60 seconds, anytime.' },
  { icon: '✅', title: 'Doctor Approval',    desc: 'Doctors review and confirm before every session.' },
  { icon: '💊', title: 'e-Prescriptions',    desc: 'Receive digital prescriptions instantly after consultation.' },
  { icon: '🔒', title: 'Private & Secure',   desc: 'End-to-end encrypted, HIPAA-compliant consultations.' },
];
const TESTIMONIALS = [
  { name: 'Anjali T.', text: 'Consulted Dr. Priya for a fever at midnight — got a prescription in 20 mins. Incredible!', rating: 5 },
  { name: 'Vikram S.', text: "Dr. Arjun's therapy sessions changed my life. So convenient and truly effective.", rating: 5 },
  { name: 'Divya M.', text: 'Booked an Ayurveda session with Dr. Kavitha. She explained everything so clearly.', rating: 5 },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      {/* Minimal public nav */}
      <header style={{ background: '#0f172a', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Dhan<span style={{ color: '#14b8a6' }}>vantari</span></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,.7)', borderColor: 'rgba(255,255,255,.2)' }} onClick={() => onNavigate('login')}>Sign In</button>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate('register-patient')}>Get Started</button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#0f172a 0%,#134e4a 60%,#0f172a 100%)', padding: 'clamp(4rem,8vw,7rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(13,148,136,.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(13,148,136,.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          <div className="badge fade-in" style={{ background: 'rgba(13,148,136,.2)', color: '#5eead4', marginBottom: 20, display: 'inline-flex' }}>✦ Trusted by 50,000+ patients</div>
          <h1 className="fade-in" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            Your Health,<br /><span style={{ color: '#14b8a6' }}>Treated Online</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.7)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Connect with certified doctors across all specialties — anytime, anywhere. Book video consultations in seconds.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register-patient')}>Get Started as Patient →</button>
            <button className="btn btn-ghost btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }} onClick={() => onNavigate('register-doctor')}>Join as Doctor</button>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ background: 'none', border: 'none', color: '#5eead4', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign In</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '2rem 1.5rem' }}>
          {[['50,000+','Consultations'],['200+','Expert Doctors'],['6+','Specialties'],['4.9 ★','Avg Rating']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '0.5rem' }}>
              <div style={{ fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 900, color: 'var(--teal)' }}>{v}</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, marginBottom: 10 }}>Why Dhanvantari?</h2>
          <p style={{ color: 'var(--text-mid)', fontSize: 16 }}>Everything you need for quality healthcare, right from your device.</p>
        </div>
        <div className="grid-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="card" style={{ transition: 'transform .2s,box-shadow .2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--teal-light)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, marginBottom: 10 }}>How It Works</h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: '3rem' }}>Simple, transparent, and patient-first.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 28 }}>
            {[['1','🔍','Find Doctor','Browse by specialty, see ratings & fees'],
              ['2','📅','Book Slot','Choose date & time, describe symptoms'],
              ['3','✅','Get Approved','Doctor reviews and confirms your booking'],
              ['4','📹','Join Meet','Join Google Meet link at appointment time']].map(([n,icon,title,desc]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(13,148,136,.3)' }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--teal)', letterSpacing: 1, marginBottom: 4 }}>STEP {n}</div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '5rem 1.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 900, textAlign: 'center', marginBottom: '2.5rem' }}>What Patients Say</h2>
        <div className="grid-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card">
              <div style={{ color: '#f59e0b', fontSize: 18, marginBottom: 10 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{t.name[0]}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--nav-bg)', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: '#fff', marginBottom: 12 }}>Ready to get treated online?</h2>
        <p style={{ color: 'rgba(255,255,255,.6)', marginBottom: 28 }}>Join thousands of patients already using Dhanvantari.</p>
        <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register-patient')}>Book Your First Consultation →</button>
      </section>

      <footer style={{ background: '#080f1a', color: 'rgba(255,255,255,.35)', textAlign: 'center', padding: '1.5rem', fontSize: 13 }}>
        <span style={{ color: '#14b8a6', fontWeight: 800 }}>Dhanvantari</span> · © 2026 · Privacy Policy · Terms of Use
      </footer>
    </div>
  );
}
