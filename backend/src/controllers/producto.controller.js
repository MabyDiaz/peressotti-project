import fs from 'fs';
import path from 'path';
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
      limit = 8,
      activo,
      search,
      idCategoria,
      tipo,
      sort,
      direction = 'DESC',
    } = req.query;

    console.log('📩 Filtros recibidos en backend:', req.query);

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filtrar por activo
    if (activo !== undefined && activo !== 'all') {
      whereClause.activo = activo === 'true';
    }

    // 🔍 Búsqueda flexible por nombre o descripción
    if (search && search.trim() !== '') {
      const palabras = search.trim().split(/\s+/); // divide por espacios
      whereClause[Op.and] = palabras.map((palabra) => ({
        [Op.or]: [
          { nombre: { [Op.like]: `%${palabra}%` } },
          { descripcion: { [Op.like]: `%${palabra}%` } },
        ],
      }));
    }

    // 📂 Filtro por categoría
    if (idCategoria) whereClause.idCategoria = Number(idCategoria);

    // 🏷️ Filtro por chip
    if (tipo === 'promociones') {
      whereClause.oferta = true;
    } else if (tipo === 'mas-vendidos') {
      whereClause.destacado = true;
    }

    const validSortFields = ['nombre', 'precio', 'createdAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortDirection = direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const order = [[sortField, sortDirection]];

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      include: [{ model: Categoria, attributes: ['id', 'nombre'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    console.log(`📦 ${productos.rows.length} productos encontrados`);

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
    console.error('❌ Error en getProductos:', err);
    res.status(500).json({
      success: false,
      error: err.message,
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
// export const createProducto = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         error: 'Datos de entrada inválidos',
//         details: errors.array(),
//       });
//     }

//     const {
//       nombre,
//       descripcion,
//       precio,
//       oferta,
//       descuento,
//       esPersonalizable,
//       idCategoria,
//     } = req.body;
//     const files = req.files || [];

//     // tomamos la primera como principal
//     const imagenPrincipal = files.length > 0 ? files[0].filename : null;
//     const todasImagenes = files.map((f) => f.filename);

//     if (!files.length && !imagen) {
//       return res.status(400).json({ error: 'Debe subir al menos una imagen' });
//     }

//     const idAdministrador = req.usuario?.id;
//     if (!idAdministrador) {
//       return res
//         .status(401)
//         .json({ error: 'No autorizado: falta administrador' });
//     }

//     const producto = await Producto.create({
//       nombre,
//       descripcion,
//       precio,
//       oferta,
//       descuento,
//       esPersonalizable,
//       idCategoria,
//       imagen: imagenPrincipal,
//       imagenes: todasImagenes,
//     });

//     res.status(201).json({
//       success: true,
//       data: producto,
//       message: 'Producto creado exitosamente',
//     });
//   } catch (err) {
//     console.error('Error en createProducto:', err);
//     res.status(500).json({
//       success: false,
//       error: 'Error interno del servidor',
//       message: 'No se pudo crear el producto',
//     });
//   }
// };

export const createProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, details: errors.array() });
    }

    const {
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      // imagenPrincipal puede venir si el frontend decide (pero en create normalmente elegimos entre las subidas)
      imagenPrincipal: imagenPrincipalBody,
      imagenPrincipalIsNew,
      imagenPrincipalIndex,
    } = req.body;

    const idAdministrador = req.usuario?.id;
    if (!idAdministrador)
      return res.status(401).json({ error: 'No autorizado' });

    // archivos subidos (nuevos)
    const uploaded = (req.files || []).map((f) => `/uploads/${f.filename}`);

    if (!uploaded.length && !imagenPrincipalBody) {
      return res.status(400).json({ error: 'Debe subir al menos una imagen' });
    }

    // determinar imagenPrincipal
    let imagenPrincipal = null;
    if (
      imagenPrincipalIsNew === 'true' &&
      typeof imagenPrincipalIndex !== 'undefined'
    ) {
      const idx = parseInt(imagenPrincipalIndex, 10);
      imagenPrincipal = uploaded[idx] || null;
    } else if (imagenPrincipalBody) {
      imagenPrincipal = imagenPrincipalBody;
    } else {
      imagenPrincipal = uploaded[0] || null;
    }

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      imagenes: uploaded,
      imagenPrincipal,
    });

    res.status(201).json({
      success: true,
      data: producto,
      message: 'Producto creado exitosamente',
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Error al crear producto' });
  }
};

// ============================
// Actualizar producto (reemplazo completo de imágenes)
// ============================
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res.status(404).json({ error: 'Producto no encontrado' });

    const {
      nombre,
      descripcion,
      precio,
      oferta,
      descuento,
      esPersonalizable,
      idCategoria,
      imagen: imagenBody, // si estabas usando 'imagen' en frontend; ajustá al nombre
      imagenPrincipal,
      imagenPrincipalIsNew,
      imagenPrincipalIndex,
      keepImagenes: keepImagenesRaw,
    } = req.body;

    // parsear keepImagenes (puede venir como JSON string)
    let keepImagenes = [];
    if (keepImagenesRaw) {
      try {
        keepImagenes =
          typeof keepImagenesRaw === 'string'
            ? JSON.parse(keepImagenesRaw)
            : keepImagenesRaw;
      } catch {
        keepImagenes = Array.isArray(keepImagenesRaw)
          ? keepImagenesRaw
          : [keepImagenesRaw];
      }
    } else {
      keepImagenes = producto.imagenes || [];
    }

    // archivos nuevos subidos
    const uploaded = (req.files || []).map((f) => `/uploads/${f.filename}`);

    // nuevas imagenes serán: keepImagenes + uploaded
    const nuevasImagenes = [...keepImagenes, ...uploaded];

    // eliminar físicamente las imágenes que estaban y ya no están (opcional)
    try {
      const originales = producto.imagenes || [];
      const eliminadas = originales.filter(
        (img) => !nuevasImagenes.includes(img)
      );
      eliminadas.forEach((imgPath) => {
        const fileRel = imgPath.replace(/^\//, ''); // 'uploads/xxx'
        const fullPath = path.join(process.cwd(), fileRel);
        fs.unlink(fullPath, (err) => {
          if (err)
            console.warn('No se pudo borrar archivo:', fullPath, err.message);
        });
      });
    } catch (err) {
      console.warn('Error al intentar borrar archivos antiguos:', err.message);
    }

    // determinar imagen principal
    let principal = null;
    if (
      imagenPrincipalIsNew === 'true' &&
      typeof imagenPrincipalIndex !== 'undefined'
    ) {
      const idx = parseInt(imagenPrincipalIndex, 10);
      principal = uploaded[idx] || null;
    } else if (imagenPrincipal) {
      principal = imagenPrincipal;
    } else if (
      producto.imagenPrincipal &&
      nuevasImagenes.includes(producto.imagenPrincipal)
    ) {
      principal = producto.imagenPrincipal;
    } else {
      principal = nuevasImagenes[0] || null;
    }

    // actualizar
    await producto.update({
      nombre: nombre ?? producto.nombre,
      descripcion: descripcion ?? producto.descripcion,
      precio: precio ?? producto.precio,
      oferta: oferta !== undefined ? oferta : producto.oferta,
      descuento: descuento ?? producto.descuento,
      esPersonalizable:
        esPersonalizable !== undefined
          ? esPersonalizable
          : producto.esPersonalizable,
      idCategoria: idCategoria ?? producto.idCategoria,
      imagenes: nuevasImagenes,
      imagenPrincipal: principal,
    });

    res.json({
      success: true,
      data: producto,
      message: 'Producto actualizado',
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: 'Error al actualizar producto' });
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
