// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Cliente, Administrador, Rol } from '../models/index.js';

const saltBcrypt = 10;

// Función para generar tokens
const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30m',
  });
  const refreshToken = jwt.sign(
    { id: payload.id, kind: payload.kind },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

// ================== CLIENTES ==================

export const registerCliente = async (req, res, next) => {
  try {
    const { nombre, apellido, email, contrasena, telefono } = req.body;

    // Validar campos mínimos
    if (!nombre || !apellido || !email || !contrasena || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
    }

    // Verificar si ya existe el email
    const existe = await Cliente.findOne({ where: { email } });
    if (existe) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, saltBcrypt);

    // Crear cliente
    const nuevo = await Cliente.create({
      nombre,
      apellido,
      telefono,
      email,
      contrasena: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente',
      data: { id: nuevo.id, email: nuevo.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar cliente',
    });
  }
};

// Login de clientes
export const loginCliente = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;
    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });
    }

    const tokens = generateTokens({
      id: cliente.id,
      rol: 'CLIENTE',
      kind: 'CLIENTE',
    });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// ================== ADMINISTRADORES ==================

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar administrador por email y traer sus roles
    const admin = await Administrador.findOne({
      where: { email: req.body.email },
      include: { model: Rol, as: 'roles', attributes: ['codigo'] },
    });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Mapear roles a array de strings
    const roles = admin.roles.map((r) => r.codigo); // ['ADMIN', 'DISENADOR']

    // Crear payload del JWT
    const payload = {
      id: admin.id,
      kind: 'ADMIN',
      roles,
    };

    // Generar token y refresh token
    const tokens = generateTokens(payload);

    res.json({
      success: true,
      message: 'Login correcto',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        usuario: {
          id: admin.id,
          email: admin.email,
          roles,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refrescar token
export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de refresco no proporcionado',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    let payload = null;

    if (decoded.kind === 'CLIENTE') {
      const cliente = await Cliente.findByPk(decoded.id);
      if (!cliente) {
        return res
          .status(401)
          .json({ success: false, message: 'Cliente no encontrado' });
      }
      payload = { id: cliente.id, rol: 'CLIENTE', kind: 'CLIENTE' };
    } else {
      const admin = await Administrador.findByPk(decoded.id, {
        include: { model: Rol, attributes: ['codigo'] },
      });
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: 'Administrador no encontrado' });
      }
      payload = {
        id: admin.id,
        roles: admin.Rols.map((r) => r.codigo),
        kind: 'ADMIN',
      };
    }

    const tokens = generateTokens(payload);
    res.json({
      success: true,
      message: 'Token refrescado exitosamente',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};
