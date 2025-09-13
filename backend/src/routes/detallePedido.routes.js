import express from 'express';
import {
  getDetallesByPedido,
  createDetalle,
  updateDetalle,
  deleteDetalle,
} from '../controllers/detallePedido.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateDetallePedidoCreate,
  validateDetallePedidoUpdate,
  validateDetallePedidoId,
  validatePedidoIdInDetalle,
} from '../middlewares/validation.js';

const router = express.Router();

// ============================
// Ver detalles de un pedido (ADMIN o dueño)
// GET /detalle-pedido/:idPedido
// ============================
router.get(
  '/:idPedido',
  protect,
  validatePedidoIdInDetalle,
  getDetallesByPedido
);

// ============================
// Crear detalle de pedido (ADMIN)
// POST /detalle-pedido
// ============================
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  validateDetallePedidoCreate,
  createDetalle
);

// ============================
// Actualizar detalle de pedido (ADMIN)
// PUT /detalle-pedido/:id
// ============================
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateDetallePedidoId,
  validateDetallePedidoUpdate,
  updateDetalle
);

// ============================
// Eliminar detalle de pedido (ADMIN)
// DELETE /detalle-pedido/:id
// ============================
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateDetallePedidoId,
  deleteDetalle
);

export default router;
