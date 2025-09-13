import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';

const Categoria = sequelize.define(
  'Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    imagenURL: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    idAdministrador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Administrador,
        key: 'id',
      },
    },
  },
  {
    tableName: 'categorias',
    timestamps: false,
  }
);

export default Categoria;
