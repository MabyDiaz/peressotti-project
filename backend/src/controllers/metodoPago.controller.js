import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { MetodoPago } from '../models/index.js';

// ============================
// Obtener todos los métodos de pago (ADMIN y CLIENTE leen, ADMIN gestiona)
// ============================
export const getMetodosPago = async (req, res) => {
  try {
    console.log('GET /metodos-pago v1');

    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = 'createdAt',
      direction = 'DESC',
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // Filtrar por estado activo (para clientes mostramos solo activos)
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    // Si el usuario es CLIENTE, forzamos solo activos
    if (req.user?.rol === 'CLIENTE') {
      whereClause.activo = true;
    }

    // Búsqueda
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const order = [[sort, direction.toUpperCase()]];

    const metodos = await MetodoPago.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    res.json({
      success: true,
      data: metodos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(metodos.count / limit),
        totalItems: metodos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error en getMetodosPago:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los métodos de pago',
    });
  }
};

// ============================
// Obtener un método de pago por ID
// ============================
export const getMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de método de pago inválido',
      });
    }

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({
        success: false,
        error: 'Método de pago no encontrado',
      });
    }

    // Si es cliente, no puede ver métodos inactivos
    if (req.user?.rol === 'CLIENTE' && !metodo.activo) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para ver este método de pago',
      });
    }

    res.json({
      success: true,
      data: metodo,
    });
  } catch (err) {
    console.error('Error en getMetodoPago:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el método de pago',
    });
  }
};

// ============================
// Crear método de pago (ADMIN)
// ============================
export const createMetodoPago = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array(),
      });
    }

    const { nombre, descripcion } = req.body;

    const nuevoMetodo = await MetodoPago.create({
      nombre,
      descripcion,
      activo: true,
    });

    res.status(201).json({
      success: true,
      data: nuevoMetodo,
      message: 'Método de pago creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createMetodoPago:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el método de pago',
    });
  }
};

// ============================
// Actualizar método de pago (ADMIN)
// ============================
export const updateMetodoPago = async (req, res) => {
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

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({
        success: false,
        error: 'Método de pago no encontrado',
      });
    }

    await metodo.update(req.body);

    res.json({
      success: true,
      data: metodo,
      message: 'Método de pago actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateMetodoPago:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el método de pago',
    });
  }
};

// ============================
// Eliminar método de pago (soft delete, ADMIN)
// ============================
export const deleteMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    const metodo = await MetodoPago.findByPk(id);
    if (!metodo) {
      return res.status(404).json({
        success: false,
        error: 'Método de pago no encontrado',
      });
    }

    await metodo.update({ activo: false });

    res.json({
      success: true,
      message: 'Método de pago eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteMetodoPago:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el método de pago',
    });
  }
};
