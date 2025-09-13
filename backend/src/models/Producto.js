import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Categoria from './Categoria.js';
import Administrador from './Administrador.js';

const Producto = sequelize.define(
  'Producto',
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

    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    oferta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },

    esPersonalizable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    idCategoria: {
      type: DataTypes.INTEGER,
      references: {
        model: Categoria,
        key: 'id',
      },
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
    tableName: 'productos',
    //timestamps: false,
  }
);

export default Producto;
