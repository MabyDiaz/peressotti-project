// import { validationResult } from 'express-validator';
// import { Op } from 'sequelize';
// import { Pedido, Cliente, DetallePedido } from '../models/index.js';

// // ============================
// // Obtener todos los pedidos
// // ============================
// export const getPedidos = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       estado,
//       search,
//       sort = 'fecha',
//       direction = 'DESC',
//     } = req.query;

//     const offset = (page - 1) * limit;

//     const whereClause = {};
//     if (estado && estado !== 'all') {
//       whereClause.estado = estado;
//     }

//     if (search) {
//       whereClause[Op.or] = [
//         { id: { [Op.like]: `%${search}%` } },
//         { estado: { [Op.like]: `%${search}%` } },
//       ];
//     }

//     const pedidos = await Pedido.findAndCountAll({
//       where: whereClause,
//       include: [
//         { model: Cliente, attributes: ['id', 'nombre', 'telefono', 'email'] },
//         { model: DetallePedido },
//       ],
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [[sort, direction.toUpperCase()]],
//     });

//     res.json({
//       success: true,
//       data: pedidos.rows,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(pedidos.count / limit),
//         totalItems: pedidos.count,
//         itemsPerPage: parseInt(limit),
//       },
//     });
//   } catch (err) {
//     console.error('Error en getPedidos:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudieron obtener los pedidos',
//     });
//   }
// };

// // ============================
// // Obtener un pedido por ID
// // ============================
// export const getPedidoById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'ID de pedido inválido',
//       });
//     }

//     const pedido = await Pedido.findByPk(id, {
//       include: [
//         { model: Cliente, attributes: ['id', 'nombre', 'telefono', 'email'] },
//         { model: DetallePedido },
//       ],
//     });

//     if (!pedido) {
//       return res.status(404).json({
//         success: false,
//         error: 'Pedido no encontrado',
//       });
//     }

//     // Validar acceso
//     if (req.user.rol === 'CLIENTE' && pedido.idCliente !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         error: 'No tienes permiso para acceder a este pedido',
//       });
//     }

//     res.json({
//       success: true,
//       data: pedido,
//     });
//   } catch (err) {
//     console.error('Error en getPedido:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudo obtener el pedido',
//     });
//   }
// };

// // ============================
// // Crear un pedido
// // ============================
// export const createPedido = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         error: 'Datos de entrada inválidos',
//         details: errors.array(),
//       });
//     }

//     const { numero, total, detalles } = req.body;

//     const nuevoPedido = await Pedido.create(
//       { idCliente, fecha, estado, total, DetallePedidos: detalles },
//       { include: [DetallePedido] }
//     );

//     res.status(201).json({
//       success: true,
//       data: nuevoPedido,
//       message: 'Pedido creado exitosamente',
//     });
//   } catch (err) {
//     console.error('Error en createPedido:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudo crear el pedido',
//     });
//   }
// };

// // ============================
// // Actualizar un pedido
// // ============================
// export const updatePedido = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         error: 'Datos de entrada inválidos',
//         details: errors.array(),
//       });
//     }

//     const pedido = await Pedido.findByPk(id);
//     if (!pedido) {
//       return res.status(404).json({
//         success: false,
//         error: 'Pedido no encontrado',
//       });
//     }

//     await pedido.update(req.body);

//     res.json({
//       success: true,
//       data: pedido,
//       message: 'Pedido actualizado exitosamente',
//     });
//   } catch (err) {
//     console.error('Error en updatePedido:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudo actualizar el pedido',
//     });
//   }
// };

// // ============================
// // Eliminar pedido (soft delete o cancelación)
// // ============================
// export const deletePedido = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const pedido = await Pedido.findByPk(id);
//     if (!pedido) {
//       return res.status(404).json({
//         success: false,
//         error: 'Pedido no encontrado',
//       });
//     }

//     await pedido.update({ estado: 'CANCELADO' });

//     res.json({
//       success: true,
//       message: 'Pedido cancelado exitosamente',
//     });
//   } catch (err) {
//     console.error('Error en deletePedido:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudo cancelar el pedido',
//     });
//   }
// };

// // ============================
// // Obtener pedidos por cliente
// // ============================
// export const getPedidosByCliente = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id || isNaN(id)) {
//       return res.status(400).json({
//         success: false,
//         error: 'ID de cliente inválido',
//       });
//     }

//     // Validar acceso
//     if (req.user.rol === 'CLIENTE' && parseInt(id) !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         error: 'No tienes permiso para acceder a estos pedidos',
//       });
//     }

//     const pedidos = await Pedido.findAll({
//       where: { idCliente: id },
//       include: [{ model: DetallePedido }],
//       order: [['createdAt', 'DESC']],
//     });

//     res.json({
//       success: true,
//       data: pedidos,
//     });
//   } catch (err) {
//     console.error('Error en getPedidosByCliente:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudieron obtener los pedidos del cliente',
//     });
//   }
// };

import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Pedido, Cliente, DetallePedido } from '../models/index.js';

// ============================
// Obtener todos los pedidos (ADMIN)
// ============================
export const getPedidos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      estado,
      estadoPago,
      search,
      sort = 'fecha',
      direction = 'DESC',
      activo = true,
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};

    // Filtrar por estado del pedido
    if (estado && estado !== 'all') {
      whereClause.estado = estado;
    }

    // Filtrar por estado de pago
    if (estadoPago && estadoPago !== 'all') {
      whereClause.estadoPago = estadoPago;
    }

    // Filtrar por activo/inactivo
    if (activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    // Búsqueda libre
    if (search) {
      whereClause[Op.or] = [
        { numero: { [Op.like]: `%${search}%` } },
        { '$Cliente.nombre$': { [Op.like]: `%${search}%` } },
      ];
    }

    const pedidos = await Pedido.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Cliente,
          attributes: ['id', 'nombre', 'apellido', 'telefono', 'email'],
        },
        { model: DetallePedido },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
    });

    res.json({
      success: true,
      data: pedidos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(pedidos.count / limit),
        totalItems: pedidos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error en getPedidos:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los pedidos',
    });
  }
};

// ============================
// Obtener un pedido por ID
// ============================
export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'telefono', 'email'] },
        { model: DetallePedido },
      ],
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    // Validar acceso si es cliente
    if (req.usuario.rol === 'CLIENTE' && pedido.idCliente !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este pedido',
      });
    }

    res.json({
      success: true,
      data: pedido,
    });
  } catch (err) {
    console.error('Error en getPedidoById:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el pedido',
    });
  }
};

// ============================
// Crear un pedido (CLIENTE o ADMIN)
// ============================
export const createPedido = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array(),
      });
    }

    const {
      numero,
      idMetodoPago,
      total,
      detalles,
      idCliente: clienteBody,
    } = req.body;

    let idCliente;
    let idAdministrador = null;

    if (req.usuario.rol === 'CLIENTE') {
      idCliente = req.usuario.id;
    } else if (req.usuario.rol === 'ADMIN') {
      idCliente = clienteBody;
      idAdministrador = req.usuario.id;
    }

    const nuevoPedido = await Pedido.create(
      {
        numero,
        idCliente,
        idAdministrador,
        idMetodoPago,
        estadoPedido: 'pendiente', // flujo del pedido
        estadoPago: 'pendiente', // control de pago
        total,
        activo: true,
        DetallePedidos: detalles,
      },
      { include: [DetallePedido] }
    );

    res.status(201).json({
      success: true,
      data: nuevoPedido,
      message: 'Pedido creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createPedido:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el pedido',
    });
  }
};

// ============================
// Actualizar un pedido (ADMIN)
// ============================
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    await pedido.update(req.body);

    res.json({
      success: true,
      data: pedido,
      message: 'Pedido actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updatePedido:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el pedido',
    });
  }
};

// ============================
// Desactivar pedido (soft delete)
// ============================
export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    await pedido.update({ activo: false });

    res.json({
      success: true,
      message: 'Pedido desactivado exitosamente',
    });
  } catch (err) {
    console.error('Error en deletePedido:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo desactivar el pedido',
    });
  }
};

// ============================
// Obtener pedidos por cliente
// ============================
export const getPedidosByCliente = async (req, res) => {
  try {
    const { id } = req.params;

    // Solo admin o dueño pueden consultar
    if (req.usuario.rol === 'CLIENTE' && parseInt(id) !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a estos pedidos',
      });
    }

    const pedidos = await Pedido.findAll({
      where: { idCliente: id, activo: true },
      include: [{ model: DetallePedido }],
      order: [['fecha', 'DESC']],
    });

    res.json({
      success: true,
      data: pedidos,
    });
  } catch (err) {
    console.error('Error en getPedidosByCliente:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los pedidos del cliente',
    });
  }
};
