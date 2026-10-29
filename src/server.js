import app from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const PORT = env.PORT;
const baseURL = `http://localhost:${PORT}`;

const printBanner = async () => {
  const now = new Date().toLocaleString('es-MX');

  try {
    const connection = await pool.getConnection();
    connection.release();

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                 API VENTAS TECH - SERVICIO ACTIVO          ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ Fecha      : ${now.padEnd(46)}║`);
    console.log(`║ Puerto     : ${String(PORT).padEnd(47)}║`);
    console.log(`║ Entorno    : ${(env.NODE_ENV || 'development').padEnd(47)}║`);
    console.log(`║ Base URL   : ${baseURL.padEnd(47)}║`);
    console.log(`║ Docs       : ${`${baseURL}/docs`.padEnd(47)}║`);
    console.log('║ DB         : ✅ Conexión MySQL OK                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║                 API VENTAS TECH - SERVICIO ACTIVO          ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║ Fecha      : ${now.padEnd(46)}║`);
    console.log(`║ Puerto     : ${String(PORT).padEnd(47)}║`);
    console.log(`║ Entorno    : ${(env.NODE_ENV || 'development').padEnd(47)}║`);
    console.log(`║ Base URL   : ${baseURL.padEnd(47)}║`);
    console.log(`║ Docs       : ${`${baseURL}/docs`.padEnd(47)}║`);
    console.log('║ DB         : ❌ Sin conexión MySQL                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  }
};

app.listen(PORT, async () => {
  await printBanner();
  console.log(`Servidor Express listo en ${baseURL}`);
  console.log(`Documentación disponible en ${baseURL}/docs`);
});