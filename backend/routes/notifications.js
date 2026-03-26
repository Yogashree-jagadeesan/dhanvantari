// backend/routes/notifications.js
const router = require('express').Router();
const pool   = require('../config/db');
const auth   = require('../middleware/auth');

// GET /api/notifications
router.get('/', auth(), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT * FROM notifications
     WHERE user_id = ?
     ORDER BY created_at DESC LIMIT 30`,
    [req.user.id]
  );
  res.json(rows);
});

// PATCH /api/notifications/read-all
router.patch('/read-all', auth(), async (req, res) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
  res.json({ message: 'All notifications marked as read' });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth(), async (req, res) => {
  await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  res.json({ message: 'Notification marked as read' });
});

module.exports = router;
