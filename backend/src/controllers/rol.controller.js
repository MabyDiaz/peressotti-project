import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Rol } from '../models/index.js';

// ============================
// Obtener todos los roles (ADMIN)
// ============================
export const getRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      activo,
      sort = 'createdAt',
      direction = 'DESC',
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    // Filtro de búsqueda por nombre o código
    if (search) {
      whereClause[Op.or] = [
        { codigo: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const order = [[sort, direction.toUpperCase()]];

    const roles = await Rol.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    res.json({
      success: true,
      data: roles.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(roles.count / limit),
        totalItems: roles.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error al obtener los roles:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los roles',
    });
  }
};

// ============================
// Obtener un rol por ID (ADMIN)
// ============================
export const getRol = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de rol inválido',
      });
    }

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado',
      });
    }

    res.json({
      success: true,
      data: rol,
    });
  } catch (err) {
    console.error('Error al obtener el rol:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el rol',
    });
  }
};

// ============================
// Crear un nuevo rol (ADMIN)
// ============================
export const createRol = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array(),
      });
    }

    const { codigo, descripcion } = req.body;

    const nuevoRol = await Rol.create({
      codigo,
      descripcion,
    });

    res.status(201).json({
      success: true,
      data: nuevoRol,
      message: 'Rol creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createRol:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el rol',
    });
  }
};

// ============================
// Actualizar un rol (ADMIN)
// ============================
export const updateRol = async (req, res) => {
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

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado',
      });
    }

    await rol.update(req.body);

    res.json({
      success: true,
      data: rol,
      message: 'Rol actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateRol:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el rol',
    });
  }
};

// ============================
// Eliminar un rol (ADMIN)
// ============================
export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado',
      });
    }

    await rol.update({ activo: false });

    res.json({
      success: true,
      message: 'Rol eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteRol:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el rol',
    });
  }
};
