// services/api.js — Centralised Axios API layer for Dhanvantari
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dhanvantari_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — clear session and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dhanvantari_token');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────
export const authAPI = {
  loginPatient:  (data) => api.post('/auth/login/patient', data),
  loginDoctor:   (data) => api.post('/auth/login/doctor',  data),
  loginAdmin:    (data) => api.post('/auth/login/admin',   data),
  registerPatient:(data)=> api.post('/auth/register/patient', data),
  registerDoctor: (data)=> api.post('/auth/register/doctor',  data),
  logout:         ()    => api.post('/auth/logout'),
  me:             ()    => api.get('/auth/me'),
};

// ── DOCTORS ───────────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:          (params)   => api.get('/doctors',           { params }),
  getById:         (id)       => api.get(`/doctors/${id}`),
  updateProfile:   (id, data) => api.put(`/doctors/${id}`,     data),
  updateAvailability:(id,data)=> api.put(`/doctors/${id}/availability`, data),
  getSchedule:     (id)       => api.get(`/doctors/${id}/schedule`),
  updateSchedule:  (id, data) => api.put(`/doctors/${id}/schedule`,   data),
  uploadCertificate:(id,form) => api.post(`/doctors/${id}/certificate`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ── PATIENTS ──────────────────────────────────────────────────────────────
export const patientAPI = {
  getProfile:    (id)       => api.get(`/patients/${id}`),
  updateProfile: (id, data) => api.put(`/patients/${id}`, data),
  getRecords:    (id)       => api.get(`/patients/${id}/records`),
  uploadRecord:  (id, form) => api.post(`/patients/${id}/records`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ── APPOINTMENTS ──────────────────────────────────────────────────────────
export const appointmentAPI = {
  create:   (data)       => api.post('/appointments',             data),
  getAll:   (params)     => api.get('/appointments',      { params }),
  getById:  (id)         => api.get(`/appointments/${id}`),
  update:   (id, data)   => api.put(`/appointments/${id}`,        data),
  cancel:   (id)         => api.put(`/appointments/${id}/cancel`),
  approve:  (id, data)   => api.put(`/appointments/${id}/approve`,data),
  reject:   (id, data)   => api.put(`/appointments/${id}/reject`, data),
  complete: (id, data)   => api.put(`/appointments/${id}/complete`,data),
};

// ── PRESCRIPTIONS ─────────────────────────────────────────────────────────
export const prescriptionAPI = {
  create:       (data) => api.post('/prescriptions',     data),
  getByAppt:    (apptId) => api.get(`/prescriptions/appointment/${apptId}`),
  getForPatient:(patId)  => api.get(`/prescriptions/patient/${patId}`),
  download:     (id)     => api.get(`/prescriptions/${id}/download`, { responseType: 'blob' }),
};

// ── PAYMENTS ──────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder:  (data)     => api.post('/payments/order',  data),
  verify:       (data)     => api.post('/payments/verify', data),
  getHistory:   (patientId)=> api.get(`/payments/patient/${patientId}`),
};

// ── ADMIN ─────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDoctors:       (params) => api.get('/admin/doctors',          { params }),
  approveDoctor:    (id)     => api.put(`/admin/doctors/${id}/approve`),
  rejectDoctor:     (id)     => api.put(`/admin/doctors/${id}/reject`),
  deleteDoctor:     (id)     => api.delete(`/admin/doctors/${id}`),
  getPatients:      (params) => api.get('/admin/patients',         { params }),
  deletePatient:    (id)     => api.delete(`/admin/patients/${id}`),
  getAppointments:  (params) => api.get('/admin/appointments',     { params }),
  toggleSite:       (data)   => api.put('/admin/settings/maintenance', data),
  getSettings:      ()       => api.get('/admin/settings'),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll:   () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export default api;
