import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';
import Cliente from './Cliente.js';
import MetodoPago from './MetodoPago.js';
import Administrador from './Administrador.js';
import CuponDescuento from './CuponDescuento.js';

const Pedido = sequelize.define(
  'Pedido',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    estado: {
      type: DataTypes.ENUM(
        'pendiente',
        'enProduccion',
        'completado',
        'entregado'
      ),
      defaultValue: 'pendiente',
    },

    estadoPago: {
      type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
      defaultValue: 'pendiente',
    },

    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    mpPagoId: { type: DataTypes.STRING }, // si se usa Mercado Pago

    comprobante: { type: DataTypes.STRING }, // si es transferencia

    idCliente: {
      type: DataTypes.INTEGER,
      references: {
        model: Cliente,
        key: 'id',
      },
    },

    idMetodoPago: {
      type: DataTypes.INTEGER,
      references: {
        model: MetodoPago,
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

    idCuponDescuento: {
      type: DataTypes.INTEGER,
      references: {
        model: CuponDescuento,
        key: 'id',
      },
    },
  },
  {
    tableName: 'pedidos',
    timestamps: false,
  }
);

export default Pedido;
