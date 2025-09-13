import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';

const Cliente = sequelize.define(
  'Cliente',
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

    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    contrasena: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    fechaRegistro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'fechaRegistro',
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
    tableName: 'clientes',
    timestamps: false,
  }
);

export default Cliente;
