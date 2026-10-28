import express from 'express';
import cors from 'cors';

import healthRoutes from './routes/healthRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import ventasRoutes from './routes/ventasRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API REST de ventas y productos',
    endpoints: {
      health: '/health',
      productos: '/api/v1/productos',
      ventas: '/api/v1/ventas'
    }
  });
});

app.use('/health', healthRoutes);
app.use('/api/v1/productos', productosRoutes);
app.use('/api/v1/ventas', ventasRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Ruta no encontrada.'
  });
});

app.use(errorHandler);

export default app;
