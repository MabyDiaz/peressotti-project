import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Cliente, Pedido } from '../models/index.js';

// ============================
// Obtener todos los clientes
// ============================
export const getClientes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = 'fechaRegistro',
      direction = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;

    // Validación de sort y direction
    const allowedSortFields = [
      'id',
      'nombre',
      'apellido',
      'telefono',
      'email',
      'fechaRegistro',
    ];
    const sortField = allowedSortFields.includes(sort) ? sort : 'fechaRegistro';
    const sortDirection = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Clausula where dinámica
    const whereClause = {};
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { apellido: { [Op.like]: `%${search}%` } },
        { telefono: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const clientes = await Cliente.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortDirection]],
    });

    // mapear para enviar fecha en formato ISO o local
    const clientesFormateados = clientes.rows.map((c) => ({
      ...c.dataValues,
      fechaRegistro: c.dataValues.fechaRegistro
        ? c.dataValues.fechaRegistro.toISOString()
        : null,
    }));

    res.json({
      success: true,
      data: clientesFormateados,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(clientes.count / limit),
        totalItems: clientes.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error en getClientes:', err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: err.message,
    });
  }
};

// ============================
// Obtener un cliente por ID (ADMIN o dueño)
// ============================
export const getCliente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de cliente inválido',
      });
    }

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado',
      });
    }

    // Validar acceso
    if (
      !req.usuario ||
      (!req.usuario.rol.includes('ADMIN') && cliente.id !== req.usuario.id)
    ) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este perfil',
      });
    }

    res.json({
      success: true,
      data: cliente,
    });
  } catch (err) {
    console.error('Error en getCliente:', err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: err.message,
    });
  }
};

// ============================
// Crear cliente
// ============================
// export const createCliente = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         error: 'Datos de entrada inválidos',
//         details: errors.array(),
//       });
//     }

//     const { nombre, apellido, email, telefono, contrasena } = req.body;

//     const nuevoCliente = await Cliente.create({
//       nombre,
//       apellido,
//       email,
//       telefono,
//       contrasena,
//     });

//     res.status(201).json({
//       success: true,
//       data: nuevoCliente,
//       message: 'Cliente creado exitosamente',
//     });
//   } catch (err) {
//     console.error('Error en createCliente:', err.message);
//     console.error(err.stack);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: err.message,
//     });
//   }
// };

// ============================
// Actualizar cliente
// ============================
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array(),
      });
    }

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado',
      });
    }

    // ⚡ Validar acceso
    if (
      !req.usuario ||
      (!req.usuario.rol.includes('ADMIN') && cliente.id !== req.usuario.id)
    ) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para modificar este perfil',
      });
    }

    await cliente.update(req.body);

    res.json({
      success: true,
      data: cliente,
      message: 'Cliente actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateCliente:', err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: err.message,
    });
  }
};

// ============================
// Eliminar cliente (soft delete)
// ============================
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado',
      });
    }

    // ⚡ Solo ADMIN puede eliminar
    if (!req.usuario || !req.usuario.rol.includes('ADMIN')) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para eliminar clientes',
      });
    }

    await cliente.update({ activo: false });

    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteCliente:', err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: err.message,
    });
  }
};

// ============================
// Ver historial de pedidos de un cliente
// ============================
export const getHistorialPedidos = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de cliente inválido',
      });
    }

    // ⚡ Validar acceso
    if (
      !req.usuario ||
      (!req.usuario.rol.includes('ADMIN') && parseInt(id) !== req.usuario.id)
    ) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver el historial de otro cliente',
      });
    }

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente no encontrado',
      });
    }

    const pedidos = await Pedido.findAll({
      where: { idCliente: id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: pedidos,
    });
  } catch (err) {
    console.error('Error en getHistorialPedidos:', err.message);
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: err.message,
    });
  }
};
