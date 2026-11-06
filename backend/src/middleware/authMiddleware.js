const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_royal_zaika_jwt_token_key_2026_xyz';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

// Optional auth: populates req.user if token is present, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', [decoded.id]);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalAuth, JWT_SECRET };

