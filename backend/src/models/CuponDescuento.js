import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Administrador from './Administrador.js';

const CuponDescuento = sequelize.define(
  'CuponDescuento',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    nombreCupon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    codigoCupon: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },

    porcentajeDescuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
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
    tableName: 'cuponesDescuento',
    timestamps: false,
  }
);

export default CuponDescuento;
