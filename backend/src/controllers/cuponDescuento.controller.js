import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { CuponDescuento, Administrador } from "../models/index.js";

// ============================
// Listar cupones (ADMIN)
// ============================
export const getCupones = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      activo,
      search,
      sort = "createdAt",
      direction = "DESC",
    } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (activo !== undefined && activo !== "all") {
      whereClause.activo = activo === "true";
    }

    if (search) {
      whereClause[Op.or] = [
        { nombreCupon: { [Op.like]: `%${search}%` } },
        { codigoCupon: { [Op.like]: `%${search}%` } },
      ];
    }

    const cupones = await CuponDescuento.findAndCountAll({
      where: whereClause,
      include: [{ model: Administrador, attributes: ["id", "nombre", "email"] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, direction.toUpperCase()]],
    });

    res.json({
      success: true,
      data: cupones.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(cupones.count / limit),
        totalItems: cupones.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error en getCupones:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los cupones",
    });
  }
};

// ============================
// Obtener cupón por ID (ADMIN)
// ============================
export const getCuponById = async (req, res) => {
  try {
    const { id } = req.params;

    const cupon = await CuponDescuento.findByPk(id, {
      include: [{ model: Administrador, attributes: ["id", "nombre", "email"] }],
    });

    if (!cupon) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }

    res.json({ success: true, data: cupon });
  } catch (err) {
    console.error("Error en getCuponById:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el cupón",
    });
  }
};

// ============================
// Crear cupón (ADMIN)
// ============================
export const createCupon = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const { nombreCupon, codigoCupon, porcentajeDescuento, idAdministrador } =
      req.body;

    const nuevoCupon = await CuponDescuento.create({
      nombreCupon,
      codigoCupon,
      porcentajeDescuento,
      idAdministrador,
      activo: true,
    });

    res.status(201).json({
      success: true,
      data: nuevoCupon,
      message: "Cupón creado exitosamente",
    });
  } catch (err) {
    console.error("Error en createCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el cupón",
    });
  }
};

// ============================
// Actualizar cupón (ADMIN)
// ============================
export const updateCupon = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    const cupon = await CuponDescuento.findByPk(id);
    if (!cupon) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }

    await cupon.update(req.body);

    res.json({
      success: true,
      data: cupon,
      message: "Cupón actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error en updateCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el cupón",
    });
  }
};

// ============================
// Eliminar cupón (soft delete)
// ============================
export const deleteCupon = async (req, res) => {
  try {
    const { id } = req.params;

    const cupon = await CuponDescuento.findByPk(id);
    if (!cupon) {
      return res.status(404).json({
        success: false,
        error: "Cupón no encontrado",
      });
    }

    await cupon.update({ activo: false });

    res.json({
      success: true,
      message: "Cupón eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error en deleteCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el cupón",
    });
  }
};

// ============================
// Validar cupón por código (CLIENTE)
// ============================
export const validarCodigoCupon = async (req, res) => {
  try {
    const { codigo } = req.params;

    const cupon = await CuponDescuento.findOne({
      where: { codigoCupon: codigo, activo: true },
    });

    if (!cupon) {
      return res.status(404).json({
        success: false,
        error: "Cupón inválido o inactivo",
      });
    }

    res.json({
      success: true,
      data: cupon,
      message: "Cupón válido",
    });
  } catch (err) {
    console.error("Error en validarCodigoCupon:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo validar el cupón",
    });
  }
};
