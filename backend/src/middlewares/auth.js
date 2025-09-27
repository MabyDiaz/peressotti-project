import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No autorizado, no hay token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar en req.user lo mínimo
    req.usuario = {
      id: decoded.id,
      kind: decoded.kind,
      roles: decoded.roles || ['CLIENTE'], // si no tiene roles explícitos
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ success: false, message: 'Token expirado' });
    }
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

// Middleware para autorizar según rol
export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.usuario.roles)
      ? req.usuario.roles
      : [req.usuario.roles];

    if (!userRoles.some((r) => rolesPermitidos.includes(r))) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción',
      });
    }

    next();
  };
};
