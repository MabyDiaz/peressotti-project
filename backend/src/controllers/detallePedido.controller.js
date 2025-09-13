// import { DetallePedido, Pedido, Producto } from '../models/index.js';

// // Obtener todos los detalles de pedido
// export const obtenerDetallesPedido = async (req, res) => {
//   try {
//     const detallesPedido = await DetallePedido.findAll({
//       include: [
//         {
//           model: Pedido,
//           attributes: ['id', 'numero', 'fecha', 'estado', 'total'],
//         },
//         {
//           model: Producto,
//           attributes: ['id', 'nombre', 'precio'],
//         },
//       ],
//     });
//     res.status(200).json(detallesPedido);
//   } catch (error) {
//     console.error('Error al obtener detalles del pedido:', error);
//     res
//       .status(500)
//       .json({ message: 'Error interno del servidor', error: error.message });
//   }
// };

// // Obtener detalle del pedido por ID
// export const obtenerDetallePedidoById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const detallePedido = await DetallePedido.findByPk(id, {
//       include: [
//         {
//           model: Pedido,
//           attributes: ['id', 'numero', 'fecha', 'estado', 'total'],
//         },
//         {
//           model: Producto,
//           attributes: ['id', 'nombre', 'precio'],
//         },
//       ],
//     });

//     if (detallePedido) {
//       res.status(200).json(detallePedido);
//     } else {
//       res.status(404).json({ message: 'Detalle de pedido no encontrado' });
//     }
//   } catch (error) {
//     console.error('Error al obtener detalle de pedido por ID:', error);
//     res
//       .status(500)
//       .json({ message: 'Error interno del servidor', error: error.message });
//   }
// };

// // Crear un nuevo detalle de pedido
// export const crearDetallePedido = async (req, res) => {
//   try {
//     const nuevoDetallePedido = await DetallePedido.create(req.body);
//     res.status(201).json(nuevoDetallePedido);
//   } catch (error) {
//     console.error('Error al crear detalle de pedido:', error);
//     if (error.name === 'SequelizeValidationError') {
//       return res.status(400).json({
//         message: 'Error de validación',
//         errors: error.errors.map((e) => e.message),
//       });
//     }
//     res
//       .status(500)
//       .json({ message: 'Error interno del servidor', error: error.message });
//   }
// };

// // Actualizar un detalle de pedido
// export const actualizarDetallePedido = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const datosActualizar = req.body;
//     // Primero, buscamos el detalle de pedido para asegurarnos de que existe.
//     const detallePedido = await DetallePedido.findByPk(id);

//     if (detallePedido) {
//       // detallePedido.update(data): Método de instancia de Sequelize para actualizar
//       // los campos del registro. 'data' es un objeto con los campos a modificar.
//       // Devuelve una promesa que resuelve con la instancia actualizada.
//       const detallePedidoActualizado = await detallePedido.update(
//         datosActualizar
//       );
//       res.status(200).json(detallePedidoActualizado);
//     } else {
//       res
//         .status(404)
//         .json({ message: 'Detalle de pedido no encontrado para actualizar' });
//     }
//   } catch (error) {
//     console.error('Error al actualizar detalle de pedido:', error);
//     if (error.name === 'SequelizeValidationError') {
//       return res.status(400).json({
//         message: 'Error de validación',
//         errors: error.errors.map((e) => e.message),
//       });
//     }
//     res
//       .status(500)
//       .json({ message: 'Error interno del servidor', error: error.message });
//   }
// };

// // Eliminar un detalle de pedido
// export const eliminarDetallePedido = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const resultado = await DetallePedido.destroy({ where: { id } });

//     if (resultado > 0) {
//       res
//         .status(200)
//         .json({ message: 'Detalle de pedido eliminado correctamente' });
//     } else {
//       res
//         .status(404)
//         .json({ message: 'Detalle de pedido no encontrado para eliminar' });
//     }
//   } catch (error) {
//     console.error('Error al eliminar detalle de pedido:', error);
//     res
//       .status(500)
//       .json({ message: 'Error interno del servidor', error: error.message });
//   }
// };

import { validationResult } from 'express-validator';
import { DetallePedido, Pedido, Producto } from '../models/index.js';

// ============================
// Ver detalles de un pedido (ADMIN o dueño)
// ============================
export const getDetallesByPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;

    const pedido = await Pedido.findByPk(idPedido, {
      include: [{ model: DetallePedido, include: [Producto] }],
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    // ⚡ Validar acceso
    if (req.user.rol === 'CLIENTE' && pedido.idCliente !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este pedido',
      });
    }

    res.json({
      success: true,
      data: pedido.DetallePedidos,
    });
  } catch (err) {
    console.error('Error en getDetallesByPedido:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los detalles del pedido',
    });
  }
};

// ============================
// Crear detalle de pedido (ADMIN)
// ============================
export const createDetalle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array(),
      });
    }

    const { idPedido, idProducto, cantidad } = req.body;

    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido) {
      return res
        .status(404)
        .json({ success: false, error: 'Pedido no encontrado' });
    }

    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res
        .status(404)
        .json({ success: false, error: 'Producto no encontrado' });
    }

    const precioUnitario = producto.precio;
    const subtotal = precioUnitario * cantidad;

    const detalle = await DetallePedido.create({
      idPedido,
      idProducto,
      cantidad,
      precioUnitario,
      subtotal,
    });

    res.status(201).json({
      success: true,
      data: detalle,
      message: 'Detalle creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createDetalle:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el detalle',
    });
  }
};

// ============================
// Actualizar detalle de pedido (ADMIN)
// ============================
export const updateDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const detalle = await DetallePedido.findByPk(id, { include: [Producto] });
    if (!detalle) {
      return res
        .status(404)
        .json({ success: false, error: 'Detalle no encontrado' });
    }

    const precioUnitario = detalle.Producto.precio;
    const subtotal = cantidad * precioUnitario;

    await detalle.update({ cantidad, precioUnitario, subtotal });

    res.json({
      success: true,
      data: detalle,
      message: 'Detalle actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateDetalle:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el detalle',
    });
  }
};

// ============================
// Eliminar detalle de pedido (ADMIN)
// ============================
export const deleteDetalle = async (req, res) => {
  try {
    const { id } = req.params;

    const detalle = await DetallePedido.findByPk(id);
    if (!detalle) {
      return res
        .status(404)
        .json({ success: false, error: 'Detalle no encontrado' });
    }

    await detalle.destroy();

    res.json({
      success: true,
      message: 'Detalle eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteDetalle:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el detalle',
    });
  }
};
