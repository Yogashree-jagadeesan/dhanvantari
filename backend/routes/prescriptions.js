// backend/routes/prescriptions.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// ── POST /api/prescriptions  (doctor writes) ─────────────────────────────
router.post('/', auth(['doctor']), async (req, res) => {
  const { appointment_id, medicines, notes } = req.body;
  if (!appointment_id || !medicines?.length)
    return res.status(400).json({ error: 'appointment_id and medicines[] required' });

  const [[appt]] = await pool.query(
    `SELECT * FROM appointments WHERE id = ? AND doctor_id = ? AND status = 'completed'`,
    [appointment_id, req.user.profileId]
  );
  if (!appt) return res.status(403).json({ error: 'Can only prescribe for your own completed appointments' });

  const [r] = await pool.query(
    'INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, medicines, notes) VALUES (?,?,?,?,?)',
    [appointment_id, req.user.profileId, appt.patient_id, JSON.stringify(medicines), notes || null]
  );

  // Notify patient
  const [[pp]] = await pool.query('SELECT user_id FROM patient_profiles WHERE id = ?', [appt.patient_id]);
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [pp.user_id, 'New Prescription 💊', 'Your doctor has issued a prescription. Check your Health Records.', 'prescription']
  );

  res.status(201).json({ id: r.insertId, message: 'Prescription created' });
});

// ── GET /api/prescriptions/patient ───────────────────────────────────────
router.get('/patient', auth(['patient']), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, dp.full_name AS doctor_name, s.name AS specialty,
            a.appointment_date
     FROM prescriptions p
     JOIN doctor_profiles dp ON dp.id = p.doctor_id
     JOIN specialties s ON s.id = dp.specialty_id
     JOIN appointments a ON a.id = p.appointment_id
     WHERE p.patient_id = ?
     ORDER BY p.issued_at DESC`,
    [req.user.profileId]
  );
  res.json(rows);
});

// ── GET /api/prescriptions/doctor ────────────────────────────────────────
router.get('/doctor', auth(['doctor']), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, pp.full_name AS patient_name, a.appointment_date
     FROM prescriptions p
     JOIN patient_profiles pp ON pp.id = p.patient_id
     JOIN appointments a ON a.id = p.appointment_id
     WHERE p.doctor_id = ?
     ORDER BY p.issued_at DESC`,
    [req.user.profileId]
  );
  res.json(rows);
});

module.exports = router;
