// backend/routes/doctors.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// ── GET /api/doctors  (public listing) ──────────────────────────────────
router.get('/', async (req, res) => {
  const { specialty, search, available } = req.query;
  let sql = `
    SELECT dp.id, dp.full_name, dp.qualification, dp.experience_years,
           dp.bio, dp.consultation_fee, dp.avatar_url, dp.rating_avg,
           dp.rating_count, dp.available_from, dp.available_to,
           dp.google_meet_link IS NOT NULL AS has_meet_link,
           s.name AS specialty_name, s.icon AS specialty_icon
    FROM doctor_profiles dp
    JOIN specialties s ON s.id = dp.specialty_id
    WHERE dp.is_approved = 1`;
  const params = [];

  if (specialty) { sql += ' AND s.name = ?'; params.push(specialty); }
  if (search)    { sql += ' AND (dp.full_name LIKE ? OR s.name LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY dp.rating_avg DESC, dp.rating_count DESC';

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

// ── GET /api/doctors/specialties ─────────────────────────────────────────
router.get('/specialties', async (_, res) => {
  const [rows] = await pool.query('SELECT * FROM specialties ORDER BY name');
  res.json(rows);
});

// ── GET /api/doctors/:id ─────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const [[doc]] = await pool.query(
    `SELECT dp.*, s.name AS specialty_name, s.icon AS specialty_icon
     FROM doctor_profiles dp
     JOIN specialties s ON s.id = dp.specialty_id
     WHERE dp.id = ? AND dp.is_approved = 1`,
    [req.params.id]
  );
  if (!doc) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doc);
});

// ── GET /api/doctors/:id/slots  (available time slots for a date) ────────
router.get('/:id/slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query param required' });

  const dayOfWeek = new Date(date).getDay();

  // Get slots not already booked
  const [slots] = await pool.query(
    `SELECT slot_time FROM availability_slots
     WHERE doctor_id = ? AND day_of_week = ? AND is_active = 1
     AND slot_time NOT IN (
       SELECT appointment_time FROM appointments
       WHERE doctor_id = ? AND appointment_date = ?
       AND status IN ('pending','approved')
     )
     ORDER BY slot_time`,
    [req.params.id, dayOfWeek, req.params.id, date]
  );
  res.json(slots.map(s => s.slot_time.slice(0, 5)));
});

// ── PATCH /api/doctors/profile  (doctor updates own profile) ────────────
router.patch('/profile', auth(['doctor']), async (req, res) => {
  const { bio, consultation_fee, google_meet_link, available_from, available_to, phone } = req.body;
  await pool.query(
    `UPDATE doctor_profiles SET
       bio              = COALESCE(?, bio),
       consultation_fee = COALESCE(?, consultation_fee),
       google_meet_link = COALESCE(?, google_meet_link),
       available_from   = COALESCE(?, available_from),
       available_to     = COALESCE(?, available_to),
       phone            = COALESCE(?, phone)
     WHERE id = ?`,
    [bio, consultation_fee, google_meet_link, available_from, available_to, phone, req.user.profileId]
  );
  res.json({ message: 'Profile updated' });
});

module.exports = router;
