import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRoutes from './routes/healthRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const documentationPath = path.join(__dirname, '..', 'documentacion-api.html');
const publicPath = path.join(__dirname, '..', 'public');

app.use('/public', express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile(documentationPath);
});

app.get('/docs', (req, res) => {
  res.sendFile(documentationPath);
});

app.use('/api/v1', healthRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/ventas', ventasRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    timestamp: new Date().toISOString(),
    message: 'Ruta no encontrada.'
  });
});

app.use(errorHandler);

export default app;
