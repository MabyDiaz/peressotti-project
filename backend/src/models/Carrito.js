import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Cliente from './Cliente.js';

const Carrito = sequelize.define(
  'Carrito',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    fechaActualizacion: {
      type: DataTypes.DATE,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    idCliente: {
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: 'id',
      },
    },
  },
  {
    tableName: 'carritos',
    timestamps: false,
  }
);

export default Carrito;
