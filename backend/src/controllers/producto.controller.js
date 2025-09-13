import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Producto, Categoria } from '../models/index.js';

// ============================
// Obtener todos los productos
// ============================
export const getProductos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      activo,
      search,
      idCategoria,
      sort = 'createdAt',
      direction = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;

    const whereClause = {};
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
      ];
    }

    if (idCategoria) {
      whereClause.idCategoria = idCategoria;
    }

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
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
    console.log(productos.rows);
  } catch (err) {
    console.error('Error en getProductos:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los productos',
    });
  }
};

// ============================
// Obtener producto por ID
// ============================
export const getProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de producto inválido',
      });
    }

    const producto = await Producto.findByPk(id, {
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (err) {
    console.error('Error en getProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el producto',
    });
  }
};

// ============================
// Obtener productos por categoría
// ============================
export const getProductosByCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = 'createdAt',
      direction = 'DESC',
    } = req.query;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de categoría inválido',
      });
    }

    const offset = (page - 1) * limit;

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
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
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
    console.error('Error en getProductosByCategoria:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los productos de la categoría',
    });
  }
};

// ============================
// Crear producto
// ============================
export const createProducto = async (req, res) => {
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
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      imagen: imagenBody, //
    } = req.body;

    const imagen = req.file
      ? `/uploads/${req.file.filename}`
      : imagenBody || null;

    if (!req.file) {
      return res.status(400).json({ error: 'La imagen es obligatoria' });
    }

    console.log('BODY recibido:', req.body);
    console.log('FILE recibido:', req.file);

    const idAdministrador = req.usuario?.id;
    if (!idAdministrador) {
      return res
        .status(401)
        .json({ error: 'No autorizado: falta administrador' });
    }

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      idAdministrador,
      imagen,
    });

    res.status(201).json({
      success: true,
      data: nuevoProducto,
      message: 'Producto creado exitosamente',
    });
  } catch (err) {
    console.error('Error en createProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear el producto',
    });
  }
};

// ============================
// Actualizar producto
// ============================
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    const {
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      imagen: imagenBody,
    } = req.body;

    const imagen = req.file
      ? `/uploads/${req.file.filename}`
      : imagenBody || producto.imagen; // 👈 mantenemos la existente si no se envía

    await producto.update({
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      imagen,
    });

    res.json({
      success: true,
      data: producto,
      message: 'Producto actualizado exitosamente',
    });
  } catch (err) {
    console.error('Error en updateProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar el producto',
    });
  }
};

// ============================
// Eliminar producto (soft delete)
// ============================
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      });
    }

    await producto.update({ activo: false });

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (err) {
    console.error('Error en deleteProducto:', err);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo eliminar el producto',
    });
  }
};

// ============================
// Obtener productos en oferta
// ============================
// export const getProductosEnOferta = async (req, res) => {
//   try {
//     const productos = await Producto.findAll({
//       where: { destacado: true, activo: true },
//       limit: 10,
//       order: [['createdAt', 'DESC']],
//     });

//     res.json({
//       success: true,
//       data: productos,
//     });
//   } catch (err) {
//     console.error('Error en getProductosDestacados:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudieron obtener los productos destacados',
//     });
//   }
// };

export const getProductosEnOferta = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { oferta: true, activo: true },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
    });

    console.log('Productos destacados:', productos);

    res.json({
      success: true,
      data: productos,
    });
  } catch (err) {
    // Mostramos el error completo en consola
    console.error('Error en getProductosDestacados:', err);

    res.status(500).json({
      success: false,
      error: err.message, // <-- mostramos el mensaje real
      message: 'No se pudieron obtener los productos destacados',
    });
  }
};
