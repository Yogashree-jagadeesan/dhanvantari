import { useState } from 'react';
import { useAuth, MOCK_DOCTORS, SPECIALTIES, TIME_SLOTS } from '../../context/AuthContext';
import { Avatar, StepBar } from '../../components/UI';

export default function FindDoctorsPage({ onNavigate }) {
  const { addAppointment, appointments } = useAuth();
  const [filter, setFilter]         = useState('All');
  const [search, setSearch]         = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [step, setStep]             = useState(1);
  const [form, setForm]             = useState({ symptoms: '', type: 'video', date: '', time: '' });
  const [done, setDone]             = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = MOCK_DOCTORS.filter(d =>
    (filter === 'All' || d.specialty_name === filter) &&
    (search === '' || d.full_name.toLowerCase().includes(search.toLowerCase()) || d.specialty_name.toLowerCase().includes(search.toLowerCase()))
  );

  const startBook = (doc) => { setSelectedDoc(doc); setStep(1); setDone(false); setForm({ symptoms: '', type: 'video', date: '', time: '' }); };

  const confirmBook = () => {
    const newAppt = {
      id: appointments.patient.length + 10,
      doctor_name: selectedDoc.full_name,
      specialty: selectedDoc.specialty_name,
      appointment_date: form.date,
      appointment_time: form.time,
      consult_type: form.type,
      status: 'pending',
      google_meet_url: null,
      symptoms: form.symptoms,
      fee_charged: selectedDoc.consultation_fee,
    };
    addAppointment(newAppt);
    setDone(true);
  };

  if (selectedDoc) return (
    <div className="page-wrapper fade-in">
      {!done && (
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => setSelectedDoc(null)}>← Back to Doctors</button>
      )}

      <div style={{ maxWidth: 580, margin: '0 auto' }}>
        <div className="card">
          {/* Doctor summary */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
            <Avatar initials={selectedDoc.initials} color={selectedDoc.color} size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{selectedDoc.full_name}</div>
              <div style={{ color: selectedDoc.color, fontWeight: 700, fontSize: 13 }}>{selectedDoc.specialty_name} · {selectedDoc.experience_years} yrs</div>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>⭐ {selectedDoc.rating_avg} ({selectedDoc.rating_count} reviews)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 900, color: 'var(--teal)', fontSize: 22 }}>₹{selectedDoc.consultation_fee}</div>
              <div style={{ fontSize: 11, color: 'var(--text-light)' }}>per session</div>
            </div>
          </div>

          {!done && <StepBar steps={['Your Concern', 'Schedule']} current={step - 1} />}

          {/* Step 1 */}
          {step === 1 && !done && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Describe Your Concern</h2>
              <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 18 }}>Step 1 of 2 · Help the doctor prepare for your session</p>
              <div className="form-group">
                <label className="form-label">Symptoms / Reason for Visit</label>
                <textarea className="form-input form-textarea" placeholder="Describe your symptoms or reason for consultation…" value={form.symptoms} onChange={e => set('symptoms', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Consultation Type</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['video','📹 Video'],['audio','📞 Audio'],['chat','💬 Chat']].map(([v,l]) => (
                    <button key={v} onClick={() => set('type', v)}
                      style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `2px solid ${form.type===v ? 'var(--teal)':'var(--border)'}`, background: form.type===v ? 'var(--teal-light)':'#fff', color: form.type===v ? 'var(--teal)':'var(--text-mid)', fontWeight: 700, cursor: 'pointer', fontSize: 13, transition: 'all .15s' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={() => setStep(2)}>Next →</button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && !done && (
            <>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Choose Date & Time</h2>
              <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 18 }}>Step 2 of 2 · Your booking request will go to the doctor for approval</p>
              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input className="form-input" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {TIME_SLOTS.map(t => (
                    <div key={t} onClick={() => set('time', t)}
                      style={{ padding: '9px 0', borderRadius: 8, border: `1.5px solid ${form.time===t ? 'var(--teal)':'var(--border)'}`, background: form.time===t ? 'var(--teal-light)':'#fff', color: form.time===t ? 'var(--teal)':'var(--text-mid)', fontWeight: form.time===t ? 700:500, fontSize: 12, cursor: 'pointer', textAlign: 'center', transition: 'all .12s' }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', marginBottom: 18, fontSize: 13, color: 'var(--text-mid)' }}>
                <strong>Summary:</strong> {selectedDoc.full_name} · {form.type} · {form.date || '—'} · {form.time || '—'} · ₹{selectedDoc.consultation_fee}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2, opacity: form.date && form.time ? 1 : 0.5 }} onClick={confirmBook} disabled={!form.date || !form.time}>
                  Send Booking Request ✓
                </button>
              </div>
            </>
          )}

          {/* Success */}
          {done && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Request Sent!</h2>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 20 }}>
                Your booking request has been sent to <strong>{selectedDoc.full_name}</strong> for <strong>{form.date}</strong> at <strong>{form.time}</strong>.<br />
                A Google Meet link will be shared once the doctor approves.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => { setSelectedDoc(null); onNavigate('appointments'); }}>View Appointments →</button>
                <button className="btn btn-outline" onClick={() => setSelectedDoc(null)}>Book Another</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Find Your Doctor</h1>
        <p className="page-subtitle">Browse certified specialists and book a consultation instantly.</p>
      </div>

      {/* Search & filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" style={{ flex: 1, minWidth: 200 }} placeholder="Search by name or specialty…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SPECIALTIES.map(sp => (
          <button key={sp} onClick={() => setFilter(sp)}
            style={{ background: filter===sp ? 'var(--teal)':'#fff', color: filter===sp ? '#fff':'var(--text-mid)', border: `1px solid ${filter===sp ? 'var(--teal)':'var(--border)'}`, padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all .15s' }}>
            {sp}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-light)' }}>{filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found</div>

      <div className="grid-2">
        {filtered.map(doc => (
          <div key={doc.id} className="card" style={{ cursor: 'pointer', transition: 'transform .2s,box-shadow .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <Avatar initials={doc.initials} color={doc.color} />
              <span className={`badge ${doc.available ? 'badge-available' : 'badge-busy'}`}>{doc.available ? 'Available' : 'Busy'}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{doc.full_name}</div>
            <div style={{ color: doc.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{doc.specialty_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 4 }}>{doc.qualification} · {doc.experience_years} yrs</div>
            <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 12 }}>{doc.bio}</div>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--text)' }}>₹{doc.consultation_fee}</span>
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}> /session</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>⭐ {doc.rating_avg} ({doc.rating_count})</span>
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 14 }} onClick={() => startBook(doc)}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
