const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const { schema, buildContext, root } = require('./graphql/schema');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, name: 'api-trab-final' }));

// REST routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// GraphQL endpoint
app.use('/graphql', graphqlHTTP((req) => ({
  schema,
  rootValue: root,
  context: buildContext(req),
  graphiql: true
})));

module.exports = { app };
