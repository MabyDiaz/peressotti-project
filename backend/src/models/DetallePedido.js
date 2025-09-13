import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Pedido from './Pedido.js';
import Producto from './Producto.js';

const DetallePedido = sequelize.define(
  'DetallePedido',
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
    },

    precioUnitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    idPedido: {
      type: DataTypes.INTEGER,
      references: {
        model: Pedido,
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
    tableName: 'detallesPedidos',
    timestamps: false,
  }
);

export default DetallePedido;
