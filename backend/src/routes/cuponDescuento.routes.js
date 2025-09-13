import express from 'express';
import {
  getCupones,
  getCuponById,
  createCupon,
  updateCupon,
  deleteCupon,
  validarCodigoCupon,
} from '../controllers/cuponDescuento.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validatePagination,
  validateCuponCreate,
  validateCuponUpdate,
  validateCuponId,
} from '../middlewares/validation.js';

const router = express.Router();

// ============================
// ADMIN
// ============================
router.get('/', protect, authorize('ADMIN'), validatePagination, getCupones);
router.get('/:id', protect, authorize('ADMIN'), validateCuponId, getCuponById);
router.post('/', protect, authorize('ADMIN'), validateCuponCreate, createCupon);
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateCuponId,
  validateCuponUpdate,
  updateCupon
);
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateCuponId,
  deleteCupon
);

// ============================
// CLIENTE (validar código en checkout)
// ============================
router.get(
  '/validar/:codigo',
  protect,
  authorize('CLIENTE'),
  validarCodigoCupon
);

export default router;
