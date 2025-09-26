// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Warn if JWT_SECRET missing
if (!JWT_SECRET) console.warn('JWT_SECRET is not set; some auth flows may fail');

// Generate JWT token
function generateToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, JWT_SECRET || 'dev_secret', { expiresIn });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET || 'dev_secret');
  } catch (err) {
    return null;
  }
}

// Express middleware to protect routes
function authenticate(req, res, next) {
  // Allow CORS from all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.sendStatus(200);

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid Authorization header' });

  const payload = verifyToken(parts[1]);
  if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = payload;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate
};
