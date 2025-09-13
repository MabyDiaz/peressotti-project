import { Router } from 'express';
import {
  getProductos,
  getProducto,
  getProductosByCategoria,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosEnOferta,
} from '../controllers/producto.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateProductoCreate,
  validateProductoUpdate,
  validateProductoId,
  validateCategoriaId,
  validatePagination,
} from '../middlewares/validation.js';
import upload from '../middlewares/upload.js';

const router = Router();

// Listar productos (público)
router.get('/', validatePagination, getProductos);

// Ver productos destacados (público)
router.get('/destacados', getProductosEnOferta);

// Ver productos por categoría (público)
router.get(
  '/categoria/:id',
  validateCategoriaId,
  validatePagination,
  getProductosByCategoria
);

// Ver producto por ID (público)
router.get('/:id', validateProductoId, getProducto);

// Crear producto (solo ADMIN)
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  upload.single('imagen'),
  validateProductoCreate,
  createProducto
);

// Actualizar producto (solo ADMIN)
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  upload.single('imagen'),
  validateProductoId,
  validateProductoUpdate,
  updateProducto
);

// Eliminar producto (solo ADMIN)
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateProductoId,
  deleteProducto
);

export default router;
