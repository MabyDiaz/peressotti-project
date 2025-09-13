import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Carrito from './Carrito.js';
import Producto from './Producto.js';

const DetalleCarrito = sequelize.define(
  'DetalleCarrito',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    precioUnitario: {
      type: DataTypes.FLOAT,
    },

    subtotal: {
      type: DataTypes.FLOAT,
    },

    fechaAgregado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    idCarrito: {
      type: DataTypes.INTEGER,
      references: {
        model: Carrito,
        key: 'id',
      },
    },

    idProducto: {
      type: DataTypes.INTEGER,
      references: {
        model: Producto,
        key: 'id',
      },
    },
  },
  {
    tableName: 'detallesCarrito',
    timestamps: false,
  }
);

export default DetalleCarrito;
