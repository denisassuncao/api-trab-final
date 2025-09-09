const { buildSchema } = require('graphql');
const itemService = require('../services/itemService');
const { verifyToken } = require('../auth');

const schema = buildSchema(`
  type Item { id: ID!, name: String! }
  type Query { myItems: [Item!]! }
  type Mutation {
    addItem(name: String!): Item!
    deleteItem(id: ID!): Boolean!
  }
`);

function buildContext(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  let user = null;
  if (token) {
    try { user = verifyToken(token); } catch (_) { user = null; }
  }
  return { user };
}

const root = {
  myItems: async (_args, ctx) => {
    if (!ctx.user) throw new Error('Unauthorized');
    return itemService.listByUser(ctx.user.sub);
  },
  addItem: async ({ name }, ctx) => {
    if (!ctx.user) throw new Error('Unauthorized');
    return itemService.create({ userId: ctx.user.sub, name });
  },
  deleteItem: async ({ id }, ctx) => {
    if (!ctx.user) throw new Error('Unauthorized');
    return itemService.remove({ userId: ctx.user.sub, id });
  }
};

module.exports = { schema, root, buildContext };
