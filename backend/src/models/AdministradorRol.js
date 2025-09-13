import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';
import Rol from './Rol.js';

const AdministradorRol = sequelize.define(
  'AdministradorRol',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idAdministrador: {
      type: DataTypes.INTEGER,
      references: {
        model: Administrador,
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
    tableName: 'administradoresroles',
    timestamps: false,
  }
);

export default AdministradorRol;
