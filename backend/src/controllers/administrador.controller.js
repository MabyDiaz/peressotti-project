import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Administrador } from '../models/index.js';
import bcrypt from 'bcryptjs';

const saltBcrypt = 10;

// ============================
// Obtener todos los administradores
// ============================
export const getAdministradores = async (req, res) => {
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

    const administradores = await Administrador.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortDirection]],
    });

    // mapear para enviar fecha en formato ISO o local
    const adminsFormateados = administradores.rows.map((c) => ({
      ...c.dataValues,
      fechaRegistro: c.dataValues.fechaRegistro
        ? c.dataValues.fechaRegistro.toISOString()
        : null,
    }));

    res.json({
      success: true,
      data: adminsFormateados,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(administradores.count / limit),
        totalItems: administradores.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error en getAdministradores:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los administradores',
    });
  }
};

// ============================
// Obtener administrador por ID
// ============================
export const getAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de administrador inválido',
      });
    }

    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: 'Administrador no encontrado',
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
      data: administrador,
    });
  } catch (err) {
    console.error('Error en getAdministrador:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el administrador',
    });
  }
};

// ============================
// Crear administrador
// ============================
export const createAdministrador = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array(),
      });
    }

    const { nombre, apellido, telefono, email, contrasena } = req.body;

    // Validar campos mínimos
    if (!nombre || !apellido || !email || !contrasena || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    // Verificar si ya existe el email
    const existe = await Administrador.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, saltBcrypt);

    const nuevoAdministrador = await Administrador.create({
      nombre,
      apellido,
      telefono,
      email,
      contrasena: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: nuevoAdministrador,
      message: 'Administrador creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createAdministrador:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el administrador',
    });
  }
};

// ============================
// Actualizar administrador
// ============================
export const updateAdministrador = async (req, res) => {
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

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: 'Administrador no encontrado',
      });
    }

    await administrador.update(req.body);

    res.json({
      success: true,
      data: administrador,
      message: 'Administrador actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateAdministrador:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el administrador',
    });
  }
};

// ============================
// Eliminar administrador (soft delete)
// ============================
export const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: 'Administrador no encontrado',
      });
    }

    await administrador.update({ activo: false });

    res.json({
      success: true,
      message: 'Administrador eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteAdministrador:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el administrador',
    });
  }
};
