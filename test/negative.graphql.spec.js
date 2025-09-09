// test/negative.graphql.spec.js
const { expect } = require('chai');
const request = require('supertest');
require('dotenv').config();
const { app } = require('../src/app');

const gql = (q) => ({ query: q });

describe('Negative paths: GraphQL', () => {
  it('bloqueia myItems sem token', async () => {
    const res = await request(app)
      .post('/graphql')
      .send(gql(`{ myItems { id name } }`))
      .expect(500); // seu express-graphql retorna 500 em erro de auth

    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an('array').with.length.greaterThan(0);
    expect(res.body.errors[0].message).to.match(/unauthorized/i);
  });

  it('bloqueia addItem com token inválido', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer invalido')
      .send(gql(`mutation { addItem(name: "X") { id name } }`))
      .expect(500); // idem

    expect(res.body).to.be.an('object');
    expect(res.body.errors).to.be.an('array').with.length.greaterThan(0);
  });
});
