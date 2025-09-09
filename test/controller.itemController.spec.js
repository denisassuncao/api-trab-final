const { expect } = require('chai');
const sinon = require('sinon');

const itemService = require('../src/services/itemService');
const ctrl = require('../src/controllers/itemController');

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    send(payload) { this.body = payload; return this; }
  };
}

describe('Controller: itemController com Sinon', () => {
  afterEach(() => sinon.restore());

  it('list chama service e retorna array', async () => {
    const fake = [{ id: '1', name: 'X' }];
    sinon.stub(itemService, 'listByUser').resolves(fake);
    const req = { user: { sub: 'u1' } };
    const res = mockRes();
    await ctrl.list(req, res);
    expect(res.body).to.equal(fake);
  });

  it('create valida retorno do service', async () => {
    const created = { id: '2', name: 'Novo' };
    sinon.stub(itemService, 'create').resolves(created);
    const req = { user: { sub: 'u1' }, body: { name: 'Novo' } };
    const res = mockRes();
    await ctrl.create(req, res);
    expect(res.statusCode).to.equal(201);
    expect(res.body).to.equal(created);
  });

  it('remove retorna 404 quando service=false', async () => {
    sinon.stub(itemService, 'remove').resolves(false);
    const req = { user: { sub: 'u1' }, params: { id: '999' } };
    const res = mockRes();
    await ctrl.remove(req, res);
    expect(res.statusCode).to.equal(404);
    expect(res.body.error).to.match(/não encontrado/i);
  });
});
