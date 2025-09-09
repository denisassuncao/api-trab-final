const itemService = require('../services/itemService');

async function list(req, res) {
  const items = await itemService.listByUser(req.user.sub);
  res.json(items);
}

async function create(req, res) {
  const { name } = req.body;
  try {
    const item = await itemService.create({ userId: req.user.sub, name });
    res.status(201).json(item);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function remove(req, res) {
  const { id } = req.params;
  const ok = await itemService.remove({ userId: req.user.sub, id });
  if (!ok) return res.status(404).json({ error: 'Item não encontrado' });
  res.status(204).send();
}

module.exports = { list, create, remove };
