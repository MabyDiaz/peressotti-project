import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';

const Rol = sequelize.define(
  'Rol',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    
  },
  {
    tableName: 'roles',
    timestamps: false,
  }
);

export default Rol;
