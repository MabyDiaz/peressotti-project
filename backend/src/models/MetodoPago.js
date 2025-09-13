import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';

const MetodoPago = sequelize.define(
  'MetodoPago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    idAdministrador: {
      type: DataTypes.INTEGER,
      references: {
        model: Administrador,
        key: 'id',
      },
    },
  },
  {
    tableName: 'metodosPago',
    timestamps: false,
  }
);

export default MetodoPago;
