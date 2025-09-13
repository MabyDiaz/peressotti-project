import express from 'express';
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  getPedidosByCliente,
} from '../controllers/pedido.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validatePedidoCreate,
  validatePedidoUpdate,
  validatePedidoIdParam, // 👈 ID de pedido normal
  validatePagination,
} from '../middlewares/validation.js';

const router = express.Router();

// ============================
// Listar pedidos (ADMIN)
// GET /pedidos
// ============================
router.get('/', protect, authorize('ADMIN'), validatePagination, getPedidos);

// ============================
// Obtener pedido por ID (ADMIN o dueño)
// GET /pedidos/:id
// ============================
router.get('/:id', protect, validatePedidoIdParam, getPedidoById);

// ============================
// Obtener pedidos por cliente (ADMIN o dueño)
// GET /pedidos/cliente/:idCliente
// ============================
router.get('/cliente/:idCliente', protect, getPedidosByCliente);

// ============================
// Crear pedido (CLIENTE)
// POST /pedidos
// ============================
router.post(
  '/',
  protect,
  authorize('CLIENTE'),
  validatePedidoCreate,
  createPedido
);

// ============================
// Actualizar pedido (ADMIN)
// PUT /pedidos/:id
// ============================
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validatePedidoIdParam,
  validatePedidoUpdate,
  updatePedido
);

// ============================
// Eliminar pedido (ADMIN)
// DELETE /pedidos/:id
// ============================
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validatePedidoIdParam,
  deletePedido
);

export default router;
