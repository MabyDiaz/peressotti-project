import { validationResult } from 'express-validator';
import { DetalleCarrito, Carrito, Producto } from '../models/index.js';

// ============================
// Ver productos de un carrito (ADMIN o dueño)
// ============================
export const getDetallesByCarrito = async (req, res) => {
  try {
    const { idCarrito } = req.params;

    const carrito = await Carrito.findByPk(idCarrito, {
      include: [{ model: DetalleCarrito, include: [Producto] }],
    });

    if (!carrito) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado',
      });
    }

    // ⚡ Validar acceso
    if (req.user.rol === 'CLIENTE' && carrito.idCliente !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este carrito',
      });
    }

    res.json({
      success: true,
      data: carrito.DetalleCarritos,
    });
  } catch (err) {
    console.error('Error en getDetallesByCarrito:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los detalles del carrito',
    });
  }
};

// ============================
// Agregar producto al carrito (CLIENTE)
// ============================
export const addProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array(),
      });
    }

    const { idCarrito, idProducto, cantidad } = req.body;

    // Verificar carrito activo
    const carrito = await Carrito.findOne({
      where: { id: idCarrito, activo: true },
    });
    if (!carrito) {
      return res
        .status(404)
        .json({ success: false, error: 'Carrito no encontrado o inactivo' });
    }

    // ⚡ Validar acceso
    if (req.user.rol === 'CLIENTE' && carrito.idCliente !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para modificar este carrito',
      });
    }

    // Verificar producto
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, error: 'Producto no encontrado' });
    }

    const precioUnitario = producto.precio;
    const subtotal = precioUnitario * cantidad;

    // Crear o actualizar detalle
    const [detalle, created] = await DetalleCarrito.findOrCreate({
      where: { idCarrito, idProducto },
      defaults: { cantidad, precioUnitario, subtotal },
    });

    if (!created) {
      const nuevaCantidad = detalle.cantidad + cantidad;
      await detalle.update({
        cantidad: nuevaCantidad,
        subtotal: nuevaCantidad * precioUnitario,
      });
    }

    // Actualizar fecha modificación del carrito
    await carrito.update({ fechaActualizacion: new Date() });

    res.status(201).json({
      success: true,
      data: detalle,
      message: 'Producto agregado al carrito',
    });
  } catch (err) {
    console.error('Error en addProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo agregar el producto al carrito',
    });
  }
};

// ============================
// Actualizar cantidad de producto (CLIENTE)
// ============================
export const updateDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const detalle = await DetalleCarrito.findByPk(id, {
      include: [Carrito, Producto],
    });
    if (!detalle) {
      return res
        .status(404)
        .json({ success: false, error: 'Detalle no encontrado' });
    }

    // ⚡ Validar acceso
    if (
      req.user.rol === 'CLIENTE' &&
      detalle.Carrito.idCliente !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para modificar este carrito',
      });
    }

    if (cantidad < 1) {
      return res
        .status(400)
        .json({ success: false, error: 'La cantidad debe ser al menos 1' });
    }

    const precioUnitario = detalle.Producto.precio;
    const subtotal = cantidad * precioUnitario;

    await detalle.update({ cantidad, precioUnitario, subtotal });
    await detalle.Carrito.update({ fechaActualizacion: new Date() });

    res.json({
      success: true,
      data: detalle,
      message: 'Cantidad actualizada exitosamente',
    });
  } catch (err) {
    console.error('Error en updateDetalle:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el detalle del carrito',
    });
  }
};

// ============================
// Eliminar producto del carrito (CLIENTE)
// ============================
export const removeProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetalleCarrito.findByPk(id, { include: [Carrito] });
    if (!detalle) {
      return res
        .status(404)
        .json({ success: false, error: 'Detalle no encontrado' });
    }

    // ⚡ Validar acceso
    if (
      req.user.rol === 'CLIENTE' &&
      detalle.Carrito.idCliente !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para modificar este carrito',
      });
    }

    const idCarrito = detalle.idCarrito;
    await detalle.destroy();
    await Carrito.update(
      { fechaActualizacion: new Date() },
      { where: { id: idCarrito } }
    );

    res.json({
      success: true,
      message: 'Producto eliminado del carrito',
    });
  } catch (err) {
    console.error('Error en removeProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el producto del carrito',
    });
  }
};
