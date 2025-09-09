const { v4: uuid } = require('uuid');
const { users, hashPassword, comparePassword, signToken } = require('../auth');

async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  const exists = users.find(u => u.email === email);
  if (exists) return res.status(409).json({ error: 'Usuário já cadastrado' });
  const user = { id: uuid(), email, passwordHash: hashPassword(password) };
  users.push(user);
  return res.status(201).json({ id: user.id, email: user.email });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  if (!comparePassword(password, user.passwordHash)) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = signToken({ sub: user.id, email: user.email });
  return res.json({ token });
}

module.exports = { register, login };
