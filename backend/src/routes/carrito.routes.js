import express from 'express';
import {
  getCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
} from '../controllers/carrito.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateCarritoCreate,
  validateCarritoUpdate,
  validateCarritoIdParam,
  validatePagination,
} from '../middlewares/validation.js';

const router = express.Router();

// ============================
// Listar carritos (ADMIN)
// GET /carritos
// ============================
router.get('/', protect, authorize('ADMIN'), validatePagination, getCarritos);

// ============================
// Obtener un carrito por ID (ADMIN o dueño)
// GET /carritos/:id
// ============================
router.get('/:id', protect, validateCarritoIdParam, getCarritoById);

// ============================
// Crear carrito (ADMIN o sistema)
// POST /carritos
// ============================
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateCarritoCreate,
  createCarrito
);

// ============================
// Actualizar carrito (ADMIN o dueño)
// PUT /carritos/:id
// ============================
router.put(
  '/:id',
  protect,
  validateCarritoIdParam,
  validateCarritoUpdate,
  updateCarrito
);

// ============================
// Eliminar carrito (ADMIN o dueño)
// DELETE /carritos/:id
// ============================
router.delete('/:id', protect, validateCarritoIdParam, deleteCarrito);

export default router;
