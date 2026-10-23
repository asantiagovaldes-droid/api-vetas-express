import express from "express";
import ventasRoutes from './routes/ventas.js';
import productosRoutes from './routes/productos.js';
import 'dotenv/config';
const app = express();
const docsHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>API de Ventas - Documentación</title>
    <style>
      :root {
        --bg: #07111f;
        --bg-soft: #0f1d2d;
        --panel: rgba(15, 23, 42, 0.82);
        --panel-strong: #111827;
        --panel-alt: #162338;
        --text: #e5eefb;
        --muted: #9fb0c9;
        --line: rgba(148, 163, 184, 0.18);
        --accent: #67e8f9;
        --accent-strong: #22d3ee;
        --success: #34d399;
        --warning: #fbbf24;
        --danger: #f87171;
        --shadow: 0 20px 60px rgba(8, 15, 30, 0.5);
      }

      * { box-sizing: border-box; }

      html { scroll-behavior: smooth; }

      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(34, 211, 238, 0.15), transparent 32%),
          radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.14), transparent 28%),
          linear-gradient(135deg, #020817 0%, var(--bg) 45%, #0a1325 100%);
        color: var(--text);
      }

      .container {
        max-width: 1180px;
        margin: 0 auto;
        padding: 48px 20px 80px;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 18px 24px;
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(12px);
        box-shadow: var(--shadow);
        position: sticky;
        top: 18px;
        z-index: 10;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
      }

      .brand-mark {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--accent), #60a5fa);
        color: #062032;
        font-weight: 900;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(52, 211, 153, 0.35);
        background: rgba(52, 211, 153, 0.08);
        color: #b7f3d8;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .status-pill::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--success);
        box-shadow: 0 0 18px rgba(52, 211, 153, 0.9);
      }

      .hero {
        margin-top: 28px;
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 24px;
        align-items: stretch;
      }

      .header-panel, .stats-panel {
        background: linear-gradient(180deg, rgba(17, 24, 39, 0.96), rgba(15, 23, 42, 0.9));
        border: 1px solid var(--line);
        border-radius: 24px;
        box-shadow: var(--shadow);
      }

      .header-panel {
        padding: 32px 28px;
      }

      .eyebrow {
        display: inline-block;
        margin-bottom: 14px;
        padding: 7px 12px;
        background: rgba(103, 232, 249, 0.12);
        color: var(--accent);
        border: 1px solid rgba(103, 232, 249, 0.2);
        border-radius: 999px;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
      }

      h1, h2, h3 { margin-top: 0; }

      h1 {
        font-size: clamp(2.2rem, 4vw, 3.4rem);
        line-height: 1.1;
        margin-bottom: 12px;
      }

      .lead {
        color: var(--muted);
        font-size: 1.08rem;
        line-height: 1.7;
        max-width: 60ch;
      }

      .meta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 24px;
      }

      .meta-box {
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(15, 25, 38, 0.96);
        border: 1px solid var(--line);
        min-width: 180px;
      }

      .meta-label {
        font-size: 11px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .meta-value {
        margin-top: 6px;
        font-weight: 700;
        font-size: 1.04rem;
      }

      .stats-panel {
        padding: 22px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
      }

      .stat {
        padding: 18px 16px;
        border-radius: 16px;
        background: rgba(19, 32, 50, 0.9);
        border: 1px solid var(--line);
      }

      .stat strong {
        display: block;
        font-size: 1.9rem;
        margin-bottom: 8px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 22px;
        margin-top: 28px;
      }

      .card {
        background: rgba(15, 23, 42, 0.82);
        border: 1px solid var(--line);
        border-radius: 20px;
        padding: 22px 22px 18px;
        box-shadow: 0 15px 35px rgba(3, 7, 18, 0.25);
      }

      .card h2 {
        font-size: 1.25rem;
        margin-bottom: 12px;
      }

      .route-line {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        flex-wrap: wrap;
      }

      .method {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 56px;
        padding: 6px 10px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .get { background: rgba(52, 211, 153, 0.13); color: #b8f5d9; border: 1px solid rgba(52, 211, 153, 0.2); }
      .post { background: rgba(251, 191, 36, 0.13); color: #fce7a1; border: 1px solid rgba(251, 191, 36, 0.2); }

      .route {
        font-weight: 700;
        color: #dfe9ff;
      }

      .description {
        color: var(--muted);
        line-height: 1.65;
        margin: 0 0 16px;
      }

      ul {
        margin: 0 0 18px;
        padding-left: 18px;
        color: var(--muted);
        line-height: 1.7;
      }

      code, pre {
        font-family: "Consolas", "Monaco", monospace;
      }

      code {
        background: rgba(148, 163, 184, 0.08);
        border: 1px solid rgba(148, 163, 184, 0.12);
        border-radius: 6px;
        padding: 2px 7px;
        color: #d8efff;
      }

      pre {
        margin: 0;
        background: linear-gradient(180deg, #101d2d, #0d1625);
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 16px 18px;
        color: #dfeaf7;
        overflow-x: auto;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .response-section {
        margin-top: 30px;
      }

      .two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
      }

      @media (max-width: 860px) {
        .hero, .two-col {
          grid-template-columns: 1fr;
        }

        .topbar {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <nav class="topbar">
        <div class="brand">
          <div class="brand-mark">V</div>
          <span>Ventas API</span>
        </div>
        <div class="status-pill">Sistema activo</div>
      </nav>

      <header class="hero">
        <section class="header-panel">
          <div class="eyebrow">API REST</div>
          <h1>Documentación de la API de Ventas</h1>
          <p class="lead">
            Plataforma para consultar ventas, consolidar información por sucursal y año, y registrar nuevas transacciones en la base de datos.
          </p>
          <div class="meta-row">
            <div class="meta-box">
              <div class="meta-label">Base URL</div>
              <div class="meta-value">http://localhost:3000</div>
            </div>
            <div class="meta-box">
              <div class="meta-label">Formato</div>
              <div class="meta-value">JSON / HTML</div>
            </div>
          </div>
        </section>

        <aside class="stats-panel">
          <div class="stat">
            <strong>4</strong>
            <span>Endpoints principales</span>
          </div>
          <div class="stat">
            <strong>3</strong>
            <span>Tipos de consulta</span>
          </div>
          <div class="stat">
            <strong>24/7</strong>
            <span>Disponibilidad de servicio</span>
          </div>
        </aside>
      </header>

      <section class="grid">
        <article class="card">
          <h2>Consultar consolidado</h2>
          <div class="route-line">
            <span class="method get">GET</span>
            <span class="route">/api/v1/ventas/consolidado</span>
          </div>
          <p class="description">Obtiene un resumen de ventas por sucursal y año.</p>
          <ul>
            <li><code>suscursal</code>: identificador de sucursal</li>
            <li><code>anio</code>: año a consultar</li>
          </ul>
          <pre>GET /api/v1/ventas/consolidado?suscursal=001&anio=2024</pre>
        </article>

        <article class="card">
          <h2>Consultar venta por ID</h2>
          <div class="route-line">
            <span class="method get">GET</span>
            <span class="route">/api/v1/ventas/:id</span>
          </div>
          <p class="description">Devuelve la información de una venta específica.</p>
          <pre>GET /api/v1/ventas/10</pre>
        </article>

        <article class="card">
          <h2>Registrar nueva venta</h2>
          <div class="route-line">
            <span class="method post">POST</span>
            <span class="route">/api/v1/ventas</span>
          </div>
          <p class="description">Registra una venta con los datos del producto, cliente, cantidad y fecha.</p>
          <pre>{
  "id_producto": 2,
  "id_cliente": 5,
  "cantidad": 3,
  "fecha_venta": "2024-06-15"
}</pre>
        </article>

        <article class="card">
          <h2>Consultar detalle de venta</h2>
          <div class="route-line">
            <span class="method post">POST</span>
            <span class="route">/api/v1/ventas/detalle</span>
          </div>
          <p class="description">Obtiene el detalle de una venta por su identificador.</p>
          <pre>POST /api/v1/ventas/detalle?id_venta=10</pre>
        </article>
      </section>

      <section class="card response-section">
        <h2>Formato de respuestas</h2>
        <div class="two-col">
          <div>
            <p class="description">Las respuestas exitosas generalmente tienen este formato:</p>
            <pre>{
  "status": "success",
  "data": {}
}</pre>
          </div>
          <div>
            <p class="description">En caso de error, el API responde con un objeto como:</p>
            <pre>{
  "error": "Bad Request",
  "message": "Debe enviar ambos parametros"
}</pre>
          </div>
        </div>
      </section>
    </div>
  </body>
</html>`;
//1. Middlewares para procesar req.body
app.use(express.json());
app.get('/', (req, res) => {
  res.type('html').send(docsHtml);
});
app.get('/docs', (req, res) => {
  res.type('html').send(docsHtml);
});
//2. Montamos las rutas con el prefijo /api/v1/ventas
app.use('/api/v1/ventas', ventasRoutes);
app.use('/api/v1/productos', productosRoutes);
//3. Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express en http://localhost:${PORT}`);
    console.log(`Documentación disponible en http://localhost:${PORT}/`);
});