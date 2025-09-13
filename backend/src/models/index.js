import sequelize from '../db/connection.js';
import Producto from './Producto.js';
import Categoria from './Categoria.js';
import Cliente from './Cliente.js';
import ClienteRol from './ClienteRol.js';
import DetallePedido from './DetallePedido.js';
import MetodoPago from './MetodoPago.js';
import Pedido from './Pedido.js';
import Carrito from './Carrito.js';
import DetalleCarrito from './DetalleCarrito.js';
import Administrador from './Administrador.js';
import Mensaje from './Mensaje.js';
import CuponDescuento from './CuponDescuento.js';
import Rol from './Rol.js';
import AdministradorRol from './AdministradorRol.js';

// Producto - Categoria (1:N)
// Un producto pertenece a una categoría
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria' });
// Una categoría tiene muchos productos
Categoria.hasMany(Producto, { foreignKey: 'idCategoria' });

// Pedido - Cliente (N-1)
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' }),
  Cliente.hasMany(Pedido, { foreignKey: 'idCliente' });

// Pedido - MetodoPago (N:1)
Pedido.belongsTo(MetodoPago, { foreignKey: 'idMetodoPago' });
MetodoPago.hasMany(Pedido, { foreignKey: 'idMetodoPago' });

// Producto - Pedido (N:M)
// Un pedido contiene muchos productos.
// Un producto puede estar en muchos pedidos.
Pedido.belongsToMany(Producto, {
  through: DetallePedido,
  foreignKey: 'idPedido',
  otherKey: 'idProducto',
});
Producto.belongsToMany(Pedido, {
  through: DetallePedido,
  foreignKey: 'idProducto',
  otherKey: 'idPedido',
});

// Pedido – CuponDescuento (N-1)
Pedido.belongsTo(CuponDescuento, { foreignKey: 'idCuponDescuento' });
CuponDescuento.hasMany(Pedido, { foreignKey: 'idCuponDescuento' });

// Pedido - DetallePedido
Pedido.hasMany(DetallePedido, { foreignKey: 'idPedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

// Producto - DetallePedido
Producto.hasMany(DetallePedido, { foreignKey: 'idProducto' });
DetallePedido.belongsTo(Producto, { foreignKey: 'idProducto' });

// Cliente - Pedido (1:N)
Cliente.hasMany(Pedido, { foreignKey: 'idCliente' });
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' });

// Cliente - Carrito (1:N)
Cliente.hasMany(Carrito, { foreignKey: 'idCliente' });
Carrito.belongsTo(Cliente, { foreignKey: 'idCliente' });

// Carrito - Producto (N:M)
Carrito.belongsToMany(Producto, {
  through: DetalleCarrito,
  foreignKey: 'idCarrito',
  otherKey: 'idProducto',
});
Producto.belongsToMany(Carrito, {
  through: DetalleCarrito,
  foreignKey: 'idProducto',
  otherKey: 'idCarrito',
});

// Carrito - DetalleCarrito (1:N)
Carrito.hasMany(DetalleCarrito, { foreignKey: 'idCarrito' });
DetalleCarrito.belongsTo(Carrito, { foreignKey: 'idCarrito' });

// Producto - DetalleCarrito (1:N)
Producto.hasMany(DetalleCarrito, { foreignKey: 'idProducto' });
DetalleCarrito.belongsTo(Producto, { foreignKey: 'idProducto' });

// Administrador - Pedido (1:N)
// Un administrador puede gestionar uno o muchos pedidos
Administrador.hasMany(Pedido, { foreignKey: 'idAdministrador' });
Pedido.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// Administrador - Cliente (1:N)
// Un administrador puede gestionar uno o muchos clientes
Administrador.hasMany(Cliente, { foreignKey: 'idAdministrador' });
Cliente.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// Administrador - Producto (1:N)
// Un administrador puede gestionar uno o muchos productos
Administrador.hasMany(Producto, { foreignKey: 'idAdministrador' });
Producto.belongsTo(Administrador, { foreignKey: 'idAdministrador' });

// Administrador – Rol (N:M) a través de AdministradorRol
Administrador.belongsToMany(Rol, {
  through: AdministradorRol,
  foreignKey: 'idAdministrador',
  otherKey: 'idRol',
  as: 'roles',
});
Rol.belongsToMany(Administrador, {
  through: AdministradorRol,
  foreignKey: 'idRol',
  otherKey: 'idAdministrador',
  as: 'administradores',
});

AdministradorRol.belongsTo(Administrador, { foreignKey: 'idAdministrador' });
AdministradorRol.belongsTo(Rol, { foreignKey: 'idRol' });

// Cliente – Rol (N:M a través de ClienteRol)
Cliente.belongsToMany(Rol, {
  through: ClienteRol,
  foreignKey: 'idCliente',
  otherKey: 'idRol',
});
Rol.belongsToMany(Cliente, {
  through: ClienteRol,
  foreignKey: 'idRol',
  otherKey: 'idCliente',
});

ClienteRol.belongsTo(Cliente, { foreignKey: 'idCliente' });
ClienteRol.belongsTo(Rol, { foreignKey: 'idRol' });

// CuponDescuento - Administrador (1:N)
CuponDescuento.belongsTo(Administrador, { foreignKey: 'idAdministrador' });
Administrador.hasMany(CuponDescuento, { foreignKey: 'idAdministrador' });

export {
  sequelize,
  Producto,
  Categoria,
  Cliente,
  ClienteRol,
  Administrador,
  AdministradorRol,
  DetallePedido,
  MetodoPago,
  Pedido,
  Carrito,
  DetalleCarrito,
  Mensaje,
  CuponDescuento,
  Rol,
};
