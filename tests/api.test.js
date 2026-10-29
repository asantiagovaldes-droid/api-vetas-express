import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

const listen = async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  return { server, port };
};

test('health endpoint should return success envelope', async () => {
  const { server, port } = await listen();

  try {
    const response = await fetch(`http://localhost:${port}/api/v1/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, 'API funcionando correctamente.');
  } finally {
    server.close();
  }
});

test('invalid id should return 400 with success false envelope', async () => {
  const { server, port } = await listen();

  try {
    const response = await fetch(`http://localhost:${port}/api/v1/ventas/abc`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.message.includes('identificador'), true);
  } finally {
    server.close();
  }
});

test('unknown route should return 404 with structured payload', async () => {
  const { server, port } = await listen();

  try {
    const response = await fetch(`http://localhost:${port}/api/v1/not-found`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.equal(body.message, 'Ruta no encontrada.');
  } finally {
    server.close();
  }
});
