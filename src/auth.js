const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // armazena { id, email, passwordHash }

function hashPassword(plain) {
  return bcrypt.hashSync(plain, 8);
}

function comparePassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = process.env.TOKEN_EXPIRES_IN || '1h';
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret);
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = {
  users,
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  authMiddleware
};
