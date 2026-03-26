// backend/routes/appointments.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// ── POST /api/appointments  (patient books) ──────────────────────────────
router.post('/', auth(['patient']), async (req, res) => {
  const { doctor_id, appointment_date, appointment_time, consult_type, symptoms } = req.body;

  if (!doctor_id || !appointment_date || !appointment_time)
    return res.status(400).json({ error: 'doctor_id, appointment_date and appointment_time are required' });

  // Verify doctor exists and is approved
  const [[doc]] = await pool.query(
    'SELECT * FROM doctor_profiles WHERE id = ? AND is_approved = 1', [doctor_id]
  );
  if (!doc) return res.status(404).json({ error: 'Doctor not found or not approved' });

  // Check for duplicate slot
  const [[clash]] = await pool.query(
    `SELECT id FROM appointments
     WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
     AND status IN ('pending','approved')`,
    [doctor_id, appointment_date, appointment_time]
  );
  if (clash) return res.status(409).json({ error: 'This time slot is already booked. Please choose another.' });

  const [result] = await pool.query(
    `INSERT INTO appointments
       (patient_id, doctor_id, appointment_date, appointment_time,
        consult_type, status, symptoms, fee_charged)
     VALUES (?,?,?,?,?,'pending',?,?)`,
    [req.user.profileId, doctor_id, appointment_date, appointment_time,
     consult_type || 'video', symptoms || null, doc.consultation_fee]
  );

  // Notify doctor
  const [[dp]] = await pool.query('SELECT user_id FROM doctor_profiles WHERE id = ?', [doctor_id]);
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [dp.user_id,
     'New Appointment Request 📅',
     `You have a new ${consult_type || 'video'} appointment request for ${appointment_date} at ${appointment_time}.`,
     'appointment']
  );

  res.status(201).json({
    id: result.insertId,
    message: 'Appointment request sent. Awaiting doctor approval.',
  });
});

// ── GET /api/appointments/patient ────────────────────────────────────────
router.get('/patient', auth(['patient']), async (req, res) => {
  const { status } = req.query;
  let sql = `
    SELECT a.*, dp.full_name AS doctor_name, s.name AS specialty,
           dp.avatar_url AS doctor_avatar
    FROM appointments a
    JOIN doctor_profiles dp ON dp.id = a.doctor_id
    JOIN specialties s ON s.id = dp.specialty_id
    WHERE a.patient_id = ?`;
  const params = [req.user.profileId];
  if (status) { sql += ' AND a.status = ?'; params.push(status); }
  sql += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// ── GET /api/appointments/doctor ─────────────────────────────────────────
router.get('/doctor', auth(['doctor']), async (req, res) => {
  const { status } = req.query;
  let sql = `
    SELECT a.*, pp.full_name AS patient_name, pp.date_of_birth,
           pp.blood_group, pp.phone AS patient_phone
    FROM appointments a
    JOIN patient_profiles pp ON pp.id = a.patient_id
    WHERE a.doctor_id = ?`;
  const params = [req.user.profileId];
  if (status) { sql += ' AND a.status = ?'; params.push(status); }
  sql += ' ORDER BY a.appointment_date ASC, a.appointment_time ASC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// ── GET /api/appointments/:id ────────────────────────────────────────────
router.get('/:id', auth(), async (req, res) => {
  const [[appt]] = await pool.query(
    `SELECT a.*, pp.full_name AS patient_name, dp.full_name AS doctor_name
     FROM appointments a
     JOIN patient_profiles pp ON pp.id = a.patient_id
     JOIN doctor_profiles  dp ON dp.id = a.doctor_id
     WHERE a.id = ?`,
    [req.params.id]
  );
  if (!appt) return res.status(404).json({ error: 'Not found' });

  // Only the patient or doctor involved can view
  if (req.user.role === 'patient' && appt.patient_id !== req.user.profileId)
    return res.status(403).json({ error: 'Forbidden' });
  if (req.user.role === 'doctor' && appt.doctor_id !== req.user.profileId)
    return res.status(403).json({ error: 'Forbidden' });

  res.json(appt);
});

// ── PATCH /api/appointments/:id/approve  (doctor) ────────────────────────
router.patch('/:id/approve', auth(['doctor']), async (req, res) => {
  const [[appt]] = await pool.query(
    'SELECT * FROM appointments WHERE id = ? AND doctor_id = ?',
    [req.params.id, req.user.profileId]
  );
  if (!appt) return res.status(403).json({ error: 'Not found or forbidden' });
  if (appt.status !== 'pending') return res.status(400).json({ error: 'Only pending appointments can be approved' });

  // Get doctor's Meet link
  const [[doc]] = await pool.query(
    'SELECT google_meet_link, full_name FROM doctor_profiles WHERE id = ?',
    [req.user.profileId]
  );
  const meetUrl = doc.google_meet_link
    || `https://meet.google.com/med-${req.params.id}-${Date.now().toString(36)}`;

  await pool.query(
    `UPDATE appointments SET status = 'approved', google_meet_url = ? WHERE id = ?`,
    [meetUrl, req.params.id]
  );

  // Notify patient
  const [[pp]] = await pool.query(
    'SELECT user_id FROM patient_profiles WHERE id = ?', [appt.patient_id]
  );
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [pp.user_id,
     'Appointment Approved! ✅',
     `Your appointment with ${doc.full_name} on ${appt.appointment_date} at ${appt.appointment_time} is confirmed. Join: ${meetUrl}`,
     'appointment']
  );

  res.json({ message: 'Appointment approved', google_meet_url: meetUrl });
});

// ── PATCH /api/appointments/:id/reject  (doctor) ─────────────────────────
router.patch('/:id/reject', auth(['doctor']), async (req, res) => {
  const { rejection_reason } = req.body;
  const [[appt]] = await pool.query(
    'SELECT * FROM appointments WHERE id = ? AND doctor_id = ?',
    [req.params.id, req.user.profileId]
  );
  if (!appt) return res.status(403).json({ error: 'Not found or forbidden' });
  if (appt.status !== 'pending') return res.status(400).json({ error: 'Only pending appointments can be rejected' });

  await pool.query(
    `UPDATE appointments SET status = 'rejected', rejection_reason = ? WHERE id = ?`,
    [rejection_reason || 'Doctor unavailable', req.params.id]
  );

  const [[pp]] = await pool.query('SELECT user_id FROM patient_profiles WHERE id = ?', [appt.patient_id]);
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [pp.user_id,
     'Appointment Rejected',
     `Your appointment on ${appt.appointment_date} was declined. Reason: ${rejection_reason || 'Doctor unavailable'}. Please rebook.`,
     'appointment']
  );

  res.json({ message: 'Appointment rejected' });
});

// ── PATCH /api/appointments/:id/complete  (doctor) ───────────────────────
router.patch('/:id/complete', auth(['doctor']), async (req, res) => {
  const { doctor_notes } = req.body;
  const [[appt]] = await pool.query(
    'SELECT * FROM appointments WHERE id = ? AND doctor_id = ? AND status = "approved"',
    [req.params.id, req.user.profileId]
  );
  if (!appt) return res.status(403).json({ error: 'Not found, forbidden, or not yet approved' });

  await pool.query(
    `UPDATE appointments SET status = 'completed', doctor_notes = ? WHERE id = ?`,
    [doctor_notes || null, req.params.id]
  );

  const [[pp]] = await pool.query('SELECT user_id FROM patient_profiles WHERE id = ?', [appt.patient_id]);
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [pp.user_id, 'Consultation Completed ✔', 'Your consultation has been marked as completed. Check your records for notes.', 'appointment']
  );

  res.json({ message: 'Marked as completed' });
});

// ── PATCH /api/appointments/:id/cancel  (patient cancels) ────────────────
router.patch('/:id/cancel', auth(['patient']), async (req, res) => {
  const [[appt]] = await pool.query(
    'SELECT * FROM appointments WHERE id = ? AND patient_id = ?',
    [req.params.id, req.user.profileId]
  );
  if (!appt) return res.status(403).json({ error: 'Not found or forbidden' });
  if (!['pending', 'approved'].includes(appt.status))
    return res.status(400).json({ error: 'Cannot cancel this appointment' });

  await pool.query(`UPDATE appointments SET status = 'cancelled' WHERE id = ?`, [req.params.id]);

  // Notify doctor
  const [[dp]] = await pool.query('SELECT user_id FROM doctor_profiles WHERE id = ?', [appt.doctor_id]);
  await pool.query(
    'INSERT INTO notifications (user_id, title, body, type) VALUES (?,?,?,?)',
    [dp.user_id, 'Appointment Cancelled', `Patient cancelled their appointment for ${appt.appointment_date} at ${appt.appointment_time}.`, 'appointment']
  );

  res.json({ message: 'Appointment cancelled' });
});

module.exports = router;
