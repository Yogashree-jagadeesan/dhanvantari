import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const MOCK_DOCTORS = [
  { id: 1, full_name: 'Dr. Priya Sharma', specialty_name: 'General Physician', qualification: 'MBBS, MD', experience_years: 12, bio: 'Expert in preventive care and chronic disease management.', consultation_fee: 499, rating_avg: 4.9, rating_count: 312, available: true, initials: 'PS', color: '#0d9488' },
  { id: 2, full_name: 'Dr. Arjun Mehta', specialty_name: 'Mental Health', qualification: 'PhD Psychology', experience_years: 9, bio: 'Specializes in anxiety, depression and stress therapy.', consultation_fee: 699, rating_avg: 4.8, rating_count: 278, available: true, initials: 'AM', color: '#7c3aed' },
  { id: 3, full_name: 'Dr. Sunita Rao', specialty_name: 'Physical Therapy', qualification: 'BPT, MPT', experience_years: 15, bio: 'Sports injuries, post-surgery rehab and pain management.', consultation_fee: 599, rating_avg: 4.7, rating_count: 195, available: false, initials: 'SR', color: '#d97706' },
  { id: 4, full_name: 'Dr. Kavitha Nair', specialty_name: 'Ayurveda', qualification: 'BAMS, MD Ayurveda', experience_years: 20, bio: 'Holistic treatment with ancient healing principles.', consultation_fee: 449, rating_avg: 4.9, rating_count: 420, available: true, initials: 'KN', color: '#16a34a' },
  { id: 5, full_name: 'Dr. Rohan Patel', specialty_name: 'Dermatology', qualification: 'MBBS, DVD', experience_years: 8, bio: 'Skin, hair and nail disorders specialist.', consultation_fee: 799, rating_avg: 4.6, rating_count: 231, available: true, initials: 'RP', color: '#db2777' },
  { id: 6, full_name: 'Dr. Meena Krishnan', specialty_name: 'Pediatrics', qualification: 'MBBS, DCH', experience_years: 18, bio: 'Dedicated to child health from newborn to adolescence.', consultation_fee: 549, rating_avg: 4.9, rating_count: 510, available: true, initials: 'MK', color: '#2563eb' },
];

export const SPECIALTIES = ['All', 'General Physician', 'Mental Health', 'Physical Therapy', 'Ayurveda', 'Dermatology', 'Pediatrics'];
export const TIME_SLOTS = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];

export const MOCK_PATIENT_APPTS = [
  { id: 1, doctor_name: 'Dr. Priya Sharma', specialty: 'General Physician', appointment_date: '2026-03-26', appointment_time: '10:00', consult_type: 'video', status: 'approved', google_meet_url: 'https://meet.google.com/abc-defg-hij', symptoms: 'Persistent headache and fever', fee_charged: 499 },
  { id: 2, doctor_name: 'Dr. Arjun Mehta', specialty: 'Mental Health', appointment_date: '2026-03-29', appointment_time: '15:00', consult_type: 'video', status: 'pending', google_meet_url: null, symptoms: 'Stress and anxiety', fee_charged: 699 },
  { id: 3, doctor_name: 'Dr. Kavitha Nair', specialty: 'Ayurveda', appointment_date: '2026-03-18', appointment_time: '11:00', consult_type: 'video', status: 'completed', google_meet_url: null, symptoms: 'General wellness check', fee_charged: 449 },
];

export const MOCK_DOCTOR_APPTS = [
  { id: 1, patient_name: 'Rahul Sharma', patient_age: 34, appointment_date: '2026-03-26', appointment_time: '10:00', consult_type: 'video', status: 'approved', symptoms: 'Persistent headache and mild fever for 3 days', google_meet_url: 'https://meet.google.com/abc-defg-hij', fee_charged: 499 },
  { id: 2, patient_name: 'Anjali Verma', patient_age: 28, appointment_date: '2026-03-27', appointment_time: '14:00', consult_type: 'video', status: 'pending', symptoms: 'Back pain, difficulty sleeping', google_meet_url: null, fee_charged: 499 },
  { id: 3, patient_name: 'Vikram Singh', patient_age: 45, appointment_date: '2026-03-27', appointment_time: '11:00', consult_type: 'audio', status: 'pending', symptoms: 'Diabetes management follow-up', google_meet_url: null, fee_charged: 499 },
  { id: 4, patient_name: 'Divya Patel', patient_age: 31, appointment_date: '2026-03-18', appointment_time: '09:00', consult_type: 'video', status: 'completed', symptoms: 'Routine check-up', google_meet_url: null, fee_charged: 499 },
];

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [appointments, setAppointments] = useState({
    patient: MOCK_PATIENT_APPTS,
    doctor:  MOCK_DOCTOR_APPTS,
  });

  const login = (data) => setAuth(data);
  const logout = () => setAuth(null);

  const addAppointment = (appt) => {
    setAppointments(prev => ({ ...prev, patient: [appt, ...prev.patient] }));
  };

  const updateDoctorAppt = (id, updates) => {
    setAppointments(prev => ({
      ...prev,
      doctor: prev.doctor.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, appointments, addAppointment, updateDoctorAppt }}>
      {children}
    </AuthContext.Provider>
  );
}
