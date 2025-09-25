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

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  // domain: 'tudominio.com', // opcional en producción
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
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

// LOGIN CLIENTE
export const loginCliente = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;
    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente)
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });

    const isMatch = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });

    const tokens = generateTokens({ id: cliente.id, kind: 'CLIENTE' });

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Login exitoso' });
  } catch (err) {
    next(err);
  }
};

// ================== ADMINISTRADORES ==================

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;
    const admin = await Administrador.findOne({
      where: { email },
      include: { model: Rol, as: 'roles', attributes: ['codigo'] },
    });
    if (!admin)
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });

    const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: 'Credenciales incorrectas' });

    const roles = admin.roles.map((r) => r.codigo);
    const tokens = generateTokens({ id: admin.id, kind: 'ADMIN', roles });

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Login exitoso' });
  } catch (err) {
    next(err);
  }
};

// Refrescar token
export const refreshToken = (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token)
    return res.status(401).json({ success: false, message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const tokens = generateTokens({
      id: decoded.id,
      kind: decoded.kind,
      roles: decoded.roles || [],
    });

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: 'Tokens renovados' });
  } catch (err) {
    console.error(err);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res
      .status(401)
      .json({ success: false, message: 'Refresh inválido' });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  return res.json({ success: true, message: 'Sesión cerrada' });
};

// PERFIL (datos del usuario logueado)
export const perfil = async (req, res) => {
  try {
    if (req.user.kind === 'CLIENTE') {
      const cliente = await Cliente.findByPk(req.user.id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'telefono'],
      });
      if (!cliente)
        return res
          .status(404)
          .json({ success: false, message: 'Cliente no encontrado' });

      return res.json({ success: true, data: cliente });
    }

    if (req.user.kind === 'ADMIN') {
      const admin = await Administrador.findByPk(req.user.id, {
        attributes: ['id', 'email'],
        include: { model: Rol, as: 'roles', attributes: ['codigo'] },
      });
      if (!admin)
        return res
          .status(404)
          .json({ success: false, message: 'Admin no encontrado' });

      return res.json({ success: true, data: admin });
    }

    return res
      .status(400)
      .json({ success: false, message: 'Tipo de usuario desconocido' });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Error al obtener perfil' });
  }
};
