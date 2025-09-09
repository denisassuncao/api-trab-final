const { expect } = require('chai');
const request = require('supertest');
require('dotenv').config();
const { app } = require('../src/app');

const gql = (q) => ({ query: q });

describe('External: GraphQL + Auth', () => {
  let token;

  before(async () => {
    await request(app).post('/api/auth/register').send({ email: 'denis@b.com', password: '123456' });
    const res = await request(app).post('/api/auth/login').send({ email: 'denis@b.com', password: '123456' });
    token = res.body.token;
  });

  it('adiciona item via GraphQL', async () => {
    await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(gql(`mutation { addItem(name: "GQL 1") { id name } }`))
      .expect(200);

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(gql(`{ myItems { id name } }`))
      .expect(200);

    expect(res.body.data.myItems).to.be.an('array').with.length(1);
    expect(res.body.data.myItems[0].name).to.equal('GQL 1');
  });
});
