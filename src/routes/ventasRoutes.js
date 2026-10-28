import { Router } from 'express';
import {
  createVenta,
  deleteVenta,
  getConsolidadoVentas,
  getDetalleVenta,
  getVentaById,
  updateVenta
} from '../controllers/ventasController.js';
import { validateIdParam, validateQueryId } from '../middlewares/validatorMiddleware.js';

const router = Router();

router.get('/consolidado', getConsolidadoVentas);
router.get('/detalle', validateQueryId('id_venta'), getDetalleVenta);
router.get('/:id', validateIdParam, getVentaById);
router.post('/detalle', validateQueryId('id_venta'), getDetalleVenta);
router.post('/', createVenta);
router.put('/:id', validateIdParam, updateVenta);
router.delete('/:id', validateIdParam, deleteVenta);

export default router;