import express from 'express';
import authRoutes from './auth.routes.js';
import clienteRoutes from './cliente.routes.js';
import administradorRoutes from './administrador.routes.js';
import productoRoutes from './producto.routes.js';
import pedidoRoutes from './pedido.routes.js';
import categoriaRoutes from './categoria.routes.js';
import rolRoutes from './rol.routes.js';
import metodoPagoRoutes from './metodoPago.routes.js';
import carritoRoutes from './carrito.routes.js';
import detalleCarritoRoutes from './detalleCarrito.routes.js';
import detallePedidoRoutes from './detallePedido.routes.js';
import cuponDescuentoRoutes from './cuponDescuento.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/administradores', administradorRoutes);
router.use('/productos', productoRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/roles', rolRoutes);
router.use('/metodospagos', metodoPagoRoutes);
router.use('/carritos', carritoRoutes);
router.use('/detallecarritos', detalleCarritoRoutes);
router.use('/detallepedidos', detallePedidoRoutes);
router.use('/cuponesdescuentos', cuponDescuentoRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
