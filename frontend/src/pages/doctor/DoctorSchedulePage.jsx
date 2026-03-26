import { useState } from 'react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const ALL_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

const DEFAULT_SCHEDULE = {
  Monday:    { active: true,  slots: ['09:00','10:00','11:00','14:00','15:00'] },
  Tuesday:   { active: true,  slots: ['09:00','10:00','11:00','14:00','15:00'] },
  Wednesday: { active: true,  slots: ['10:00','11:00','15:00','16:00']         },
  Thursday:  { active: true,  slots: ['09:00','10:00','11:00','14:00','15:00'] },
  Friday:    { active: true,  slots: ['09:00','10:00','14:00']                 },
  Saturday:  { active: false, slots: []                                        },
  Sunday:    { active: false, slots: []                                        },
};

const AVAILABILITY_OPTIONS = [
  { value: 'free',  label: '🟢 Available',  color: '#16a34a', bg: 'rgba(22,163,74,.1)'  },
  { value: 'busy',  label: '🟡 Busy',        color: '#d97706', bg: 'rgba(217,119,6,.1)'  },
  { value: 'leave', label: '🔴 On Leave',    color: '#dc2626', bg: 'rgba(220,38,38,.1)'  },
];

export default function DoctorSchedulePage() {
  const [schedule, setSchedule]       = useState(DEFAULT_SCHEDULE);
  const [availability, setAvailability] = useState('free');
  const [saved, setSaved]             = useState(false);

  const toggleDay = (day) => {
    setSchedule(s => ({ ...s, [day]: { ...s[day], active: !s[day].active, slots: s[day].active ? [] : ['09:00','10:00','11:00'] } }));
  };

  const toggleSlot = (day, slot) => {
    setSchedule(s => {
      const current = s[day].slots;
      const updated = current.includes(slot) ? current.filter(t => t !== slot) : [...current, slot].sort();
      return { ...s, [day]: { ...s[day], slots: updated } };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const totalSlots = Object.values(schedule).reduce((acc, d) => acc + d.slots.length, 0);
  const activeDays = Object.values(schedule).filter(d => d.active).length;

  const currentStatus = AVAILABILITY_OPTIONS.find(o => o.value === availability);

  return (
    <div className="page-wrapper fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Schedule & Availability</h1>
          <p style={{ color: 'var(--text-mid)', fontSize: 14, marginTop: 4 }}>Set your weekly schedule and toggle your availability status.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleSave}>
          {saved ? '✅ Saved!' : '💾 Save Schedule'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          ['📅', activeDays,    'Active Days',  'var(--teal)' ],
          ['⏰', totalSlots,   'Total Slots',   'var(--blue)' ],
          ['🟢', totalSlots,   'Open Slots',    '#16a34a'     ],
          ['📋', 4,            'Booked Today',  'var(--amber)'],
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

      <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
        {/* Weekly schedule */}
        <div className="card">
          <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>📆 Weekly Schedule</h2>
          {DAYS.map(day => (
            <div key={day} style={{ marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: schedule[day].active ? 12 : 0 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{day}</span>
                <div onClick={() => toggleDay(day)}
                  style={{ width: 44, height: 24, borderRadius: 12, background: schedule[day].active ? 'var(--teal)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background .25s' }}>
                  <div style={{ position: 'absolute', top: 3, left: schedule[day].active ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .25s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                </div>
              </div>
              {schedule[day].active && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_SLOTS.map(slot => {
                    const isSelected = schedule[day].slots.includes(slot);
                    return (
                      <button key={slot} onClick={() => toggleSlot(day, slot)}
                        style={{ padding: '5px 12px', borderRadius: 8, border: `1.5px solid ${isSelected ? 'var(--teal)' : 'var(--border)'}`, background: isSelected ? 'var(--teal)' : '#fff', color: isSelected ? '#fff' : 'var(--text-mid)', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
              {!schedule[day].active && (
                <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Day off</span>
              )}
            </div>
          ))}
        </div>

        {/* Availability status + today's overview */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>🟢 Current Availability</h2>
            <p style={{ fontSize: 14, color: 'var(--text-mid)', marginBottom: 16 }}>
              Patients can see your real-time status when browsing doctors.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AVAILABILITY_OPTIONS.map(opt => (
                <div key={opt.value} onClick={() => setAvailability(opt.value)}
                  style={{ border: `2px solid ${availability === opt.value ? opt.color : 'var(--border)'}`, background: availability === opt.value ? opt.bg : '#fff', borderRadius: 12, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .15s' }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{opt.label}</span>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${opt.color}`, background: availability === opt.value ? opt.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {availability === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, background: currentStatus.bg, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: currentStatus.color, fontWeight: 600 }}>
              You are currently: <strong>{currentStatus.label}</strong>
            </div>
          </div>

          {/* Today's appointments */}
          <div className="card">
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>📋 Today's Appointments</h2>
            {[
              { time: '10:00', patient: 'Rahul Sharma',  type: '📹 Video', status: 'approved' },
              { time: '11:00', patient: 'Anjali Verma',  type: '📞 Audio', status: 'pending'  },
              { time: '14:00', patient: 'Vikram Singh',  type: '📹 Video', status: 'approved' },
            ].map((appt, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{appt.patient}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>{appt.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--teal)' }}>⏰ {appt.time}</div>
                  <span style={{ fontSize: 11, background: appt.status === 'approved' ? 'rgba(20,184,166,.12)' : 'rgba(245,158,11,.12)', color: appt.status === 'approved' ? 'var(--teal)' : 'var(--amber)', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                    {appt.status === 'approved' ? '✅ Confirmed' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
