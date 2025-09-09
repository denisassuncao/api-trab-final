// test/external.api.spec.js
const { expect } = require('chai');
const request = require('supertest');
require('dotenv').config();
const { app } = require('../src/app');

describe('External: API REST + Auth', () => {
  let token;

  it('registra usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'denis@d.com', password: '123456' })
      .expect(201);
    expect(res.body).to.have.keys(['id', 'email']);
  });

  it('loga e retorna token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'denis@d.com', password: '123456' })
      .expect(200);
    token = res.body.token;
    expect(token).to.be.a('string');
  });

  it('cria e lista itens (REST) autenticado', async () => {
    await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Item 1' })
      .expect(201);

    const res = await request(app)
      .get('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).to.be.an('array').with.length(1);
    expect(res.body[0]).to.include({ name: 'Item 1' });
  });

  it('deleta item existente (204) e depois retorna 404 ao deletar novamente', async () => {
    // reusa o mesmo usuário: loga para garantir token atual
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'denis@d.com', password: '123456' })
      .expect(200);
    const tokenLocal = login.body.token;

    // cria um item novo para deletar
    const created = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${tokenLocal}`)
      .send({ name: 'Apagar' })
      .expect(201);

    const { id } = created.body;

    // deleta (204)
    await request(app)
      .delete(`/api/items/${id}`)
      .set('Authorization', `Bearer ${tokenLocal}`)
      .expect(204);

    // tenta deletar de novo -> 404
    await request(app)
      .delete(`/api/items/${id}`)
      .set('Authorization', `Bearer ${tokenLocal}`)
      .expect(404);
  });
});
