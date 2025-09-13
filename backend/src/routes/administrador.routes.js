import { Router } from 'express';
import {
  getAdministradores,
  getAdministrador,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
} from '../controllers/administrador.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateAdministradorCreate,
  validateAdministradorUpdate,
  validateAdministradorId,
  validatePagination,
} from '../middlewares/validation.js';

const router = Router();

// Listar administradores (solo ADMIN)
router.get(
  '/',
  protect,
  authorize('ADMIN'),
  validatePagination,
  getAdministradores
);

// Ver administrador por ID (solo ADMIN)
router.get(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateAdministradorId,
  getAdministrador
);

// Crear administrador (solo ADMIN)
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateAdministradorCreate,
  createAdministrador
);

// Actualizar administrador (solo ADMIN)
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateAdministradorId,
  validateAdministradorUpdate,
  updateAdministrador
);

// Eliminar administrador (solo ADMIN)
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateAdministradorId,
  deleteAdministrador
);

export default router;
