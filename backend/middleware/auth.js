// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * authMiddleware(roles?)
 * roles: [] = any authenticated user
 *        ['patient'] = patients only
 *        ['doctor']  = doctors only
 *        ['admin']   = admins only
 */
const authMiddleware = (roles = []) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    req.user = decoded; // { id, role, profileId }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
