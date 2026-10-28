import { Router } from 'express';
import {
  createProducto,
  deleteProducto,
  getProductoById,
  getProductos,
  updateProducto
} from '../controllers/productosController.js';
import { validateIdParam } from '../middlewares/validatorMiddleware.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', validateIdParam, getProductoById);
router.post('/', createProducto);
router.put('/:id', validateIdParam, updateProducto);
router.delete('/:id', validateIdParam, deleteProducto);

export default router;
