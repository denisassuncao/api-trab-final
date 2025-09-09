// test/negative.rest.spec.js
const { expect } = require('chai');
const request = require('supertest');
require('dotenv').config();
const { app } = require('../src/app');

describe('Negative paths: REST Auth + Items', () => {
  it('não permite acessar /api/items sem token (401)', async () => {
    const res = await request(app).get('/api/items').expect(401);
    expect(res.body.error).to.match(/token/i);
  });

  it('retorna 400 ao criar item sem nome', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'denisass@ex.com', password: '123456' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'denisass@ex.com', password: '123456' });

    const token = login.body.token;

    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400); 

    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('error');
    expect(res.body.error).to.match(/name|obrigat(ó|o)rio/i); // mensagem do service: "nome é obrigatório"
  });

  it('não loga com senha errada (401)', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'denisass@ex.com', password: '123456' });

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'denisass@ex.com', password: 'wrong' })
      .expect(401);
  });

  it('não registra email duplicado (409)', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'assuncao@ex.com', password: '123456' })
      .expect(201);

    await request(app)
      .post('/api/auth/register')
      .send({ email: 'assuncao@ex.com', password: '123456' })
      .expect(409);
  });

  it('nega token inválido (401)', async () => {
    await request(app)
      .get('/api/items')
      .set('Authorization', 'Bearer token_falso')
      .expect(401);
  });
});
