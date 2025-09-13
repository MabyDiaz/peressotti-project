import express from 'express';
import {
  getMetodosPago,
  getMetodoPago,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
} from '../controllers/metodoPago.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validatePagination,
  validateMetodoPagoCreate,
  validateMetodoPagoUpdate,
  validateMetodoPagoId,
} from '../middlewares/validation.js';

const router = express.Router();

// Listar métodos de pago (CLIENTE ve solo activos)
router.get('/', protect, validatePagination, getMetodosPago);

// Obtener un método de pago
router.get('/:id', protect, validateMetodoPagoId, getMetodoPago);

// Crear método de pago (ADMIN)
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateMetodoPagoCreate,
  createMetodoPago
);

// Actualizar método de pago (ADMIN)
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateMetodoPagoId,
  validateMetodoPagoUpdate,
  updateMetodoPago
);

// Eliminar método de pago (ADMIN - soft delete)
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateMetodoPagoId,
  deleteMetodoPago
);

export default router;
