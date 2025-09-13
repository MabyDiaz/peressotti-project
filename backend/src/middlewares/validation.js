import { body, param, query } from 'express-validator';

// ======================
// VALIDACIÓN PAGINACIÓN
// ======================
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
];

// ======================
// VALIDACIÓN CLIENTE
// ======================
export const validateClienteCreate = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('apellido')
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),

  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('telefono')
    .optional()
    .isString()
    .withMessage('El teléfono debe ser texto'),

  body('contrasena')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export const validateClienteUpdate = [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('apellido').optional().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('telefono').optional().isString(),
  body('contrasena').optional().isLength({ min: 6 }),
];

export const validateClienteId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ======================
// VALIDACIÓN ADMINISTRADOR
// ======================
export const validateAdministradorCreate = [
  body('nombre').notEmpty().isLength({ min: 2, max: 100 }),
  body('apellido').notEmpty().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('telefono').optional().isString(),
  body('contrasena').isLength({ min: 6 }),
];

export const validateAdministradorUpdate = [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('apellido').optional().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('telefono').optional().isString(),
  body('contrasena').optional().isLength({ min: 6 }),
];

export const validateAdministradorId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ======================
// VALIDACIÓN PRODUCTO
// ======================
export const validateProductoCreate = [
  body('nombre').notEmpty().isLength({ min: 2, max: 100 }),
  body('descripcion').notEmpty().isLength({ max: 1000 }),
  body('precio').isFloat({ min: 0 }),
  body('descuento').optional().isInt({ min: 0, max: 100 }),
  body('idCategoria').isInt({ min: 1 }),
];

export const validateProductoUpdate = [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('descripcion').optional().isLength({ max: 1000 }),
  body('precio').optional().isFloat({ min: 0 }),
  body('imagen').optional(),
  body('descuento').optional().isInt({ min: 0, max: 100 }),
  body('idCategoria').optional().isInt({ min: 1 }),
  body('idAdministrador').optional().isInt({ min: 1 }),
];

export const validateProductoId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ======================
// VALIDACIÓN PEDIDO
// ======================
export const validatePedidoCreate = [
  body('numero').notEmpty().withMessage('El número de pedido es requerido'),
  body('idCliente')
    .isInt({ min: 1 })
    .withMessage('El ID de cliente debe ser un número entero positivo'),
  body('idMetodoPago')
    .isInt({ min: 1 })
    .withMessage('El ID de método de pago debe ser un número entero positivo'),
  body('total')
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número mayor o igual a 0'),
];

export const validatePedidoUpdate = [
  body('estado')
    .optional()
    .isIn(['pendiente', 'enProduccion', 'completado', 'entregado']),
  body('estadoPago').optional().isIn(['pendiente', 'aprobado', 'rechazado']),
  body('total').optional().isFloat({ min: 0 }),
];

export const validatePedidoIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ======================
// VALIDACIÓN CATEGORIA
// ======================
export const validateCategoriaCreate = [
  body('nombre').notEmpty().isLength({ min: 2, max: 100 }),
  // body('imagenURL').notEmpty(), // <-- quitar esta línea
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'La imagen es obligatoria' });
    }
    next();
  },
  (req, res, next) => {
    if (!req.usuario?.id) {
      return res
        .status(401)
        .json({ error: 'No autorizado: falta administrador' });
    }
    next();
  },
];

export const validateCategoriaUpdate = [
  body('nombre').optional().isLength({ min: 2, max: 100 }),
  body('imagenURL').optional(),
  body('idAdministrador').optional().isInt({ min: 1 }),
];

export const validateCategoriaId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ======================
// VALIDACIÓN ROL
// ======================
export const validateRolCreate = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('codigo')
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 2, max: 20 })
    .withMessage('El código debe tener entre 2 y 20 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
];

export const validateRolUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('codigo')
    .optional()
    .isLength({ min: 2, max: 20 })
    .withMessage('El código debe tener entre 2 y 20 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
];

export const validateRolId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

//=========================
// VALIDACIÓN METODOPAGO
//=========================
export const validateMetodoPagoCreate = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
];

export const validateMetodoPagoUpdate = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser true o false'),
];

export const validateMetodoPagoId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// =====================
// VALIDACINES CARRITO
// =====================
export const validateCarritoCreate = [
  body('clienteId')
    .isInt({ min: 1 })
    .withMessage(
      'El clienteId es requerido y debe ser un número entero positivo'
    ),
];

export const validateCarritoUpdate = [
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser true o false'),
  body('cupon')
    .optional()
    .isString()
    .withMessage('El cupón debe ser un texto válido'),
];

export const validateCarritoIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ============================
// VALIDACIONES DETALLECARRITO
// ============================

export const validateDetalleCreate = [
  body('idCarrito')
    .isInt({ min: 1 })
    .withMessage(
      'El idCarrito es requerido y debe ser un número entero positivo'
    ),
  body('idProducto')
    .isInt({ min: 1 })
    .withMessage(
      'El idProducto es requerido y debe ser un número entero positivo'
    ),
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
];

export const validateDetalleUpdate = [
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
];

export const validateDetalleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del detalle debe ser un número entero positivo'),
];

export const validateCarritoIdInDetalle = [
  param('idCarrito')
    .isInt({ min: 1 })
    .withMessage('El ID del carrito debe ser un número entero positivo'),
];

// ============================
// VALIDACIONES DETALLEPEDIDO
// ============================

export const validateDetallePedidoCreate = [
  body('idPedido')
    .isInt({ min: 1 })
    .withMessage(
      'El idPedido es requerido y debe ser un número entero positivo'
    ),
  body('idProducto')
    .isInt({ min: 1 })
    .withMessage(
      'El idProducto es requerido y debe ser un número entero positivo'
    ),
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
];

export const validateDetallePedidoUpdate = [
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
];

export const validateDetallePedidoId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del detalle debe ser un número entero positivo'),
];

export const validatePedidoIdInDetalle = [
  param('idPedido')
    .isInt({ min: 1 })
    .withMessage('El ID del pedido debe ser un número entero positivo'),
];

// ============================
// Validaciones CuponDescuento
// ============================
export const validateCuponCreate = [
  body('nombreCupon')
    .notEmpty()
    .withMessage('El nombre del cupón es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('codigoCupon')
    .notEmpty()
    .withMessage('El código del cupón es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El código debe tener entre 3 y 50 caracteres'),
  body('porcentajeDescuento')
    .isInt({ min: 1, max: 100 })
    .withMessage('El porcentaje de descuento debe ser un número entre 1 y 100'),
  body('idAdministrador')
    .isInt({ min: 1 })
    .withMessage('El idAdministrador es requerido y debe ser positivo'),
];

export const validateCuponUpdate = [
  body('nombreCupon')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('codigoCupon')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('El código debe tener entre 3 y 50 caracteres'),
  body('porcentajeDescuento')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El porcentaje de descuento debe ser un número entre 1 y 100'),
];

export const validateCuponId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
];

// ============================
// VALIDACIONES FORMULARIO
// ============================
export const validateFormularioCreate = [
  body('nombreCliente')
    .notEmpty()
    .withMessage('El nombre del cliente es requerido')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres'),
  body('telefonoCliente')
    .notEmpty()
    .withMessage('El teléfono es requerido')
    .isLength({ min: 5, max: 50 })
    .withMessage('El teléfono debe tener entre 5 y 50 caracteres'),
  body('comentarios')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Los comentarios no pueden superar los 1000 caracteres'),
  body('idDetalleCarrito')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idDetalleCarrito debe ser un número entero positivo'),
  body('idDetallePedido')
    .optional()
    .isInt({ min: 1 })
    .withMessage('idDetallePedido debe ser un número entero positivo'),
];

export const validateFormularioUpdate = [
  body('telefonoCliente')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('El teléfono debe tener entre 5 y 50 caracteres'),
  body('comentarios')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Los comentarios no pueden superar los 1000 caracteres'),
];

export const validateFormularioId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del formulario debe ser un número entero positivo'),
];
