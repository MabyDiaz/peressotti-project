import { Router } from 'express';
import {
  getClientes,
  getCliente,
  // createCliente,
  updateCliente,
  deleteCliente,
  getHistorialPedidos,
} from '../controllers/cliente.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateClienteCreate,
  validateClienteUpdate,
  validateClienteId,
  validatePagination,
} from '../middlewares/validation.js';

const router = Router();

// Listar clientes (solo ADMIN)
router.get('/', protect, authorize('ADMIN'), validatePagination, getClientes);

// Ver cliente por ID (solo ADMIN)
router.get('/:id', protect, authorize('ADMIN'), validateClienteId, getCliente);

// Ver historial de pedidos de un cliente (ADMIN o el mismo cliente)
router.get('/:id/pedidos', protect, validateClienteId, getHistorialPedidos);

// Crear cliente (registro público)
//router.post('/', validateClienteCreate, createCliente);

// Actualizar cliente (ADMIN)
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateClienteId,
  validateClienteUpdate,
  updateCliente
);

// Eliminar cliente (soft delete, ADMIN)
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateClienteId,
  deleteCliente
);

export default router;
