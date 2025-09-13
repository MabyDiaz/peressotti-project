import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Cliente from './Cliente.js';
import Rol from './Rol.js';

const ClienteRol = sequelize.define(
  'ClienteRol',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    idCliente: {
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: 'id',
      },
    },

    idRol: {
      type: DataTypes.INTEGER,
      references: {
        model: Rol,
        key: 'id',
      },
    },
  },
  {
    tableName: 'clientesroles',
    timestamps: false,
  }
);

export default ClienteRol;
