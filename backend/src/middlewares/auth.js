import jwt from 'jsonwebtoken';
import { Cliente, Administrador, Rol } from '../models/index.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.kind === 'CLIENTE') {
        req.usuario = await Cliente.findByPk(decoded.id, {
          attributes: { exclude: ['contrasena'] },
        });
        req.usuario.rol = ['CLIENTE'];
      } else {
        req.usuario = await Administrador.findByPk(decoded.id, {
          attributes: { exclude: ['contrasena'] },
          include: { model: Rol, as: 'roles', attributes: ['codigo'] },
        });
        req.usuario.rol = req.usuario?.roles?.map((r) => r.codigo) || [];
      }

      if (!req.usuario) {
        return res
          .status(401)
          .json({ success: false, message: 'Usuario no encontrado' });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ success: false, message: 'Token expirado' });
      }
      return res
        .status(401)
        .json({ success: false, message: 'Token inválido' });
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: 'No autorizado, no hay token' });
  }
};

// Middleware para autorizar según rol
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.usuario.rol)
      ? req.usuario.rol
      : [req.usuario.rol];

    if (!userRoles.some((r) => rolesPermitidos.includes(r))) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción',
      });
    }

    next();
  };
};
