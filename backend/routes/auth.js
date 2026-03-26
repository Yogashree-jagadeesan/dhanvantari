// backend/routes/auth.js
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

// ── POST /api/auth/register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const {
    email, password, role, full_name,
    phone, date_of_birth, gender, blood_group, // patient fields
    specialty_id, qualification, experience_years, consultation_fee, bio, google_meet_link, // doctor fields
  } = req.body;

  if (!email || !password || !role || !full_name)
    return res.status(400).json({ error: 'email, password, role and full_name are required' });

  if (!['patient', 'doctor'].includes(role))
    return res.status(400).json({ error: 'role must be patient or doctor' });

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const hash = await bcrypt.hash(password, 12);

    const [ur] = await conn.query(
      'INSERT INTO users (email, password_hash, role, is_verified) VALUES (?,?,?,1)',
      [email.toLowerCase().trim(), hash, role]
    );
    const userId = ur.insertId;

    if (role === 'patient') {
      await conn.query(
        `INSERT INTO patient_profiles
           (user_id, full_name, phone, date_of_birth, gender, blood_group)
         VALUES (?,?,?,?,?,?)`,
        [userId, full_name, phone || null, date_of_birth || null, gender || null, blood_group || null]
      );
    } else {
      await conn.query(
        `INSERT INTO doctor_profiles
           (user_id, full_name, specialty_id, qualification, experience_years,
            consultation_fee, bio, phone, google_meet_link, is_approved)
         VALUES (?,?,?,?,?,?,?,?,?,0)`,
        [userId, full_name, specialty_id || 1, qualification || null,
         experience_years || 0, consultation_fee || 499,
         bio || null, phone || null, google_meet_link || null]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (e) {
    await conn.rollback();
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'An account with this email already exists' });
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
});

// ── POST /api/auth/login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const [[user]] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email.toLowerCase().trim()]
  );

  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  if (role && user.role !== role)
    return res.status(401).json({ error: `No ${role} account found with this email` });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  let profile = null;
  let profileId = null;

  if (user.role === 'patient') {
    [[profile]] = await pool.query(
      'SELECT * FROM patient_profiles WHERE user_id = ?', [user.id]
    );
    profileId = profile?.id;
  } else if (user.role === 'doctor') {
    [[profile]] = await pool.query(
      `SELECT dp.*, s.name AS specialty_name, s.icon AS specialty_icon
       FROM doctor_profiles dp
       JOIN specialties s ON s.id = dp.specialty_id
       WHERE dp.user_id = ?`,
      [user.id]
    );
    profileId = profile?.id;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, profileId },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({ token, role: user.role, profile });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  // Client discards token; if using refresh tokens, revoke here
  res.json({ message: 'Logged out' });
});

module.exports = router;
