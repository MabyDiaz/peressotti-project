import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Categoria, Producto } from '../models/index.js';

// Obtener todas las categorías con filtros y paginación
export const getCategorias = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = 'id',
      direction = 'DESC',
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }
    if (search) {
      whereClause[Op.or] = [{ nombre: { [Op.like]: `%${search}%` } }];
    }

    const categorias = await Categoria.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
    });

    res.json({
      success: true,
      data: categorias.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(categorias.count / limit),
        totalItems: categorias.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Obtener una categoría por ID
export const getCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'ID inválido' });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: 'Categoría no encontrada' });
    }

    res.json({ success: true, data: categoria });
  } catch (err) {
    next(err);
  }
};

// Obtener productos por categoría
export const getProductosByCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, activo, search } = req.query;
    const offset = (page - 1) * limit;

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: 'Categoría no encontrada' });
    }

    const whereClause = { idCategoria: id };
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Crear categoría
export const createCategoria = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array(),
      });
    }

    const { nombre } = req.body;

    // req.file contiene la imagen subida por multer
    const imagenURL = req.file ? `/uploads/${req.file.filename}` : '';

    // req.usuario debe venir del middleware de autenticación
    const idAdministrador = req.usuario?.id || null;

    const nuevaCategoria = await Categoria.create({
      nombre,
      imagenURL,
      activo: true,
      idAdministrador,
    });

    res.status(201).json({
      success: true,
      data: nuevaCategoria,
      message: 'Categoría creada exitosamente',
    });
  } catch (err) {
    next(err);
  }
};

// Actualizar categoría
export const updateCategoria = async (req, res, next) => {
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

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: 'Categoría no encontrada' });
    }

    await categoria.update(req.body);
    res.json({
      success: true,
      data: categoria,
      message: 'Categoría actualizada exitosamente',
    });
  } catch (err) {
    next(err);
  }
};

// Eliminar (soft delete)
export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ success: false, error: 'Categoría no encontrada' });
    }

    await categoria.update({ activo: false });
    res.json({ success: true, message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
};
