import express from 'express';
import {
  getDetallesByCarrito,
  addProducto,
  updateDetalle,
  removeProducto,
} from '../controllers/detalleCarrito.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateDetalleCreate,
  validateDetalleUpdate,
  validateDetalleId,
  validateCarritoIdInDetalle,
} from '../middlewares/validation.js';

const router = express.Router();

// ============================
// Ver productos de un carrito (ADMIN o dueño)
// GET /detalle-carrito/:idCarrito
// ============================
router.get(
  '/:idCarrito',
  protect,
  validateCarritoIdInDetalle,
  getDetallesByCarrito
);

// ============================
// Agregar producto al carrito (CLIENTE)
// POST /detalle-carrito
// ============================
router.post(
  '/',
  protect,
  authorize('CLIENTE'),
  validateDetalleCreate,
  addProducto
);

// ============================
// Actualizar cantidad de un producto (CLIENTE)
// PUT /detalle-carrito/:id
// ============================
router.put(
  '/:id',
  protect,
  authorize('CLIENTE'),
  validateDetalleId,
  validateDetalleUpdate,
  updateDetalle
);

// ============================
// Eliminar un producto del carrito (CLIENTE)
// DELETE /detalle-carrito/:id
// ============================
router.delete(
  '/:id',
  protect,
  authorize('CLIENTE'),
  validateDetalleId,
  removeProducto
);

export default router;
