import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Carrito, Cliente, DetalleCarrito, Producto } from '../models/index.js';

// ============================
// Listar carritos (ADMIN)
// ============================
export const getCarritos = async (req, res) => {
  try {
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
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    if (search) {
      whereClause[Op.or] = [{ id: { [Op.like]: `%${search}%` } }];
    }

    const carritos = await Carrito.findAndCountAll({
      where: whereClause,
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'email'] },
        {
          model: DetalleCarrito,
          include: [
            { model: Producto, attributes: ['id', 'nombre', 'precio'] },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
    });

    res.json({
      success: true,
      data: carritos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(carritos.count / limit),
        totalItems: carritos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error('Error en getCarritos:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los carritos',
    });
  }
};

// ============================
// Obtener carrito por ID (ADMIN o dueño)
// ============================
export const getCarritoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de carrito inválido',
      });
    }

    const carrito = await Carrito.findByPk(id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'email'] },
        {
          model: DetalleCarrito,
          include: [
            { model: Producto, attributes: ['id', 'nombre', 'precio'] },
          ],
        },
      ],
    });

    if (!carrito) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado',
      });
    }

    // Solo ADMIN o el dueño pueden acceder
    if (req.user.rol === 'CLIENTE' && carrito.clienteId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para acceder a este carrito',
      });
    }

    res.json({
      success: true,
      data: carrito,
    });
  } catch (err) {
    console.error('Error en getCarritoById:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el carrito',
    });
  }
};

// ============================
// Crear carrito (se crea vacío, normalmente al registrarse o al iniciar un flujo de compra)
// ============================
export const createCarrito = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array(),
      });
    }

    const { clienteId } = req.body;

    const nuevoCarrito = await Carrito.create({
      clienteId,
      activo: true,
    });

    res.status(201).json({
      success: true,
      data: nuevoCarrito,
      message: 'Carrito creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createCarrito:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el carrito',
    });
  }
};

// ============================
// Actualizar carrito (ej. aplicar cupón, actualizar estado)
// ============================
export const updateCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array(),
      });
    }

    const carrito = await Carrito.findByPk(id);
    if (!carrito) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado',
      });
    }

    // Validar acceso
    if (req.user.rol === 'CLIENTE' && carrito.clienteId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para modificar este carrito',
      });
    }

    await carrito.update(req.body);

    res.json({
      success: true,
      data: carrito,
      message: 'Carrito actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateCarrito:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el carrito',
    });
  }
};

// ============================
// Eliminar carrito (soft delete → marcar inactivo)
// ============================
export const deleteCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const carrito = await Carrito.findByPk(id);
    if (!carrito) {
      return res.status(404).json({
        success: false,
        error: 'Carrito no encontrado',
      });
    }

    // ⚡ Solo ADMIN o el dueño
    if (req.user.rol === 'CLIENTE' && carrito.clienteId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permiso para eliminar este carrito',
      });
    }

    await carrito.update({ activo: false });

    res.json({
      success: true,
      message: 'Carrito eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteCarrito:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el carrito',
    });
  }
};
