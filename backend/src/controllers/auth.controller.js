import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { sendPasswordResetEmail } from '../utils/mailer.js';
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
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
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

    return res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
      },
    });
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

    return res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: admin.id,
        nombre: admin.nombre,
        apellido: admin.apellido,
        email: admin.email,
        roles: roles,
      },
    });
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
    if (req.usuario.kind === 'CLIENTE') {
      const cliente = await Cliente.findByPk(req.usuario.id, {
        attributes: ['id', 'nombre', 'apellido', 'email', 'telefono'],
      });
      if (!cliente)
        return res
          .status(404)
          .json({ success: false, message: 'Cliente no encontrado' });

      return res.json({ success: true, data: cliente });
    }

    if (req.usuario.kind === 'ADMIN') {
      const admin = await Administrador.findByPk(req.usuario.id, {
        attributes: ['id', 'nombre', 'apellido', 'email'],
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

// ================== LOGIN CON GOOGLE ==================
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body; // id_token que manda el frontend
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: 'Falta token de Google' });
    }

    // Validar token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = payload.email;
    const googleId = payload.sub;
    const nombre = payload.given_name || 'Usuario';
    const apellido = payload.family_name || '';
    const picture = payload.picture;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Google no devolvió email' });
    }

    // Buscar cliente
    let cliente = await Cliente.findOne({ where: { email } });

    if (!cliente) {
      // Crear uno nuevo si no existe
      cliente = await Cliente.create({
        nombre,
        apellido,
        telefono: '',
        email,
        contrasena: `GOOGLE_${googleId}`, // valor dummy para no dejar null
        googleId,
        avatar: picture,
      });
    } else {
      // Actualizar info si hace falta
      await cliente.update({
        googleId: cliente.googleId || googleId,
        avatar: cliente.avatar || picture,
      });
    }

    // Generar tokens
    const tokens = generateTokens({ id: cliente.id, kind: 'CLIENTE' });

    // Setear cookies
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login con Google exitoso',
      data: {
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email,
        avatar: cliente.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Error en login con Google' });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: 'Email requerido' });

    const cliente = await Cliente.findOne({ where: { email } });
    if (!cliente) {
      return res.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace.',
      });
    }

    const generatePasswordResetToken = (email) => {
      return jwt.sign({ email }, process.env.JWT_RESET_SECRET, {
        expiresIn: '1h',
      });
    };

    const token = generatePasswordResetToken(cliente.email);
    await sendPasswordResetEmail(cliente.email, token);

    return res.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace.',
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Error al solicitar recuperación' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, contrasena } = req.body;
    if (!token || !contrasena) {
      return res
        .status(400)
        .json({ success: false, message: 'Datos incompletos' });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const cliente = await Cliente.findOne({ where: { email: decoded.email } });
    if (!cliente)
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado' });

    const hashed = await bcrypt.hash(contrasena, 10);
    await cliente.update({ contrasena: hashed });

    return res.json({
      success: true,
      message: 'Contraseña restablecida con éxito',
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ success: false, message: 'Token inválido o expirado' });
  }
};
