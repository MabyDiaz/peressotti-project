import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Producto from './Producto.js';

const Mensaje = sequelize.define(
  'Mensaje',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    texto: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'mensajes',
    timestamps: false,
  }
);

export default Mensaje;
