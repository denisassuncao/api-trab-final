const { v4: uuid } = require('uuid');

// Em memória: items = [{ id, userId, name }]
const items = [];

async function listByUser(userId) {
  return items.filter(i => i.userId === userId);
}

async function create({ userId, name }) {
  if (!name) throw new Error('Nome é obrigatório');
  const item = { id: uuid(), userId, name };
  items.push(item);
  return item;
}

async function remove({ userId, id }) {
  const idx = items.findIndex(i => i.userId === userId && i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

module.exports = { listByUser, create, remove, __items: items };
