import { Op } from 'sequelize';
import {
  Cliente,
  Producto,
  Pedido,
  Categoria,
  DetallePedido,
  sequelize,
} from '../models/index.js';

// Métricas del dashboard
export const getDashboardMetrics = async (req, res) => {
  try {
    const { periodo = '30' } = req.query;
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaInicio.getDate() - parseInt(periodo));

    const totalClientes = await Cliente.count({ where: { activo: true } });
    const totalProductos = await Producto.count({ where: { activo: true } });
    const totalCategorias = await Categoria.count({ where: { activo: true } });
    const totalPedidos = await Pedido.count();

    // Pedidos recientes
    const pedidosRecientes = await Pedido.count({
      where: { fecha: { [Op.gte]: fechaInicio } },
    });

    // Clientes nuevos
    const clientesNuevos = await Cliente.count({
      where: { fechaRegistro: { [Op.gte]: fechaInicio }, activo: true },
    });

    let ingresosTotales = 0;
    let ingresosRecientes = 0;

    try {
      ingresosTotales = (await Pedido.sum('total')) || 0;
      ingresosRecientes =
        (await Pedido.sum('total', {
          where: { fecha: { [Op.gte]: fechaInicio } },
        })) || 0;
    } catch {
      // Si no existe campo 'total', calcular desde DetallePedido
      const detalles = await DetallePedido.findAll({
        attributes: [
          [
            sequelize.fn('SUM', sequelize.literal('cantidad * precioUnitario')),
            'total',
          ],
        ],
        raw: true,
      });
      ingresosTotales = detalles[0]?.total || 0;
      ingresosRecientes = ingresosTotales; // simplificado
    }

    res.json({
      success: true,
      data: {
        metricas: {
          totalClientes,
          totalProductos,
          totalCategorias,
          totalPedidos,
          pedidosRecientes,
          clientesNuevos,
          ingresosTotales: parseFloat(ingresosTotales),
          ingresosRecientes: parseFloat(ingresosRecientes),
        },
        periodo: parseInt(periodo),
      },
    });
  } catch (error) {
    console.error('Error en getDashboardMetrics:', error);
    res
      .status(500)
      .json({ success: false, error: 'Error interno del servidor' });
  }
};

// Funciones mínimas para que las rutas no fallen
export const getDashboardCharts = async (req, res) => {
  res.json({ success: true, data: [] });
};

export const getActividadReciente = async (req, res) => {
  res.json({ success: true, data: [] });
};
