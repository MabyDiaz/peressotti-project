import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Eye,
} from 'lucide-react';
import MetricCard from '../components/MetricCard.jsx';
import api from '../../api/axios';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [metricas, setMetricas] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [actividad, setActividad] = useState(null);
  const [periodo, setPeriodo] = useState(30);
  const [loading, setLoading] = useState(true);

  const cargarDatosDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [metricasRes, chartsRes, actividadRes] = await Promise.all([
        api.get(`/dashboard/metrics?periodo=${periodo}`),
        api.get(`/dashboard/charts?periodo=${periodo}`),
        api.get(`/dashboard/actividad?limite=5`),
      ]);

      setMetricas(metricasRes.data.data);
      setChartData(chartsRes.data.data);
      setActividad(actividadRes.data.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    cargarDatosDashboard();
  }, [cargarDatosDashboard]);

  // Configuraciones de gráficos
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pedidos por Día',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Productos Más Vendidos',
      },
    },
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-3'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600 text-sm'>Resumen del Sitio Web</p>
        </div>
        <div className='flex items-center space-x-4'>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className='border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard
          title='Total Clientes'
          value={metricas?.metricas.totalClientes || 0}
          icon={Users}
          color='blue'
        />
        <MetricCard
          title='Total Pedidos'
          value={metricas?.metricas.totalPedidos || 0}
          icon={ShoppingCart}
          color='green'
        />
        <MetricCard
          title='Productos'
          value={metricas?.metricas.totalProductos || 0}
          icon={Package}
          color='purple'
        />
        <MetricCard
          title='Ingresos Totales'
          value={`$${
            metricas?.metricas.ingresosTotales?.toLocaleString() || 0
          }`}
          icon={DollarSign}
          color='yellow'
        />
      </div>

      {/* Gráficos principales */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Gráfico de líneas - Pedidos por día */}
        {/* <div className='bg-white p-6 rounded-lg shadow-md'>
          {chartData?.pedidosPorDia && (
            <Line
              data={{
                labels: chartData.pedidosPorDia.map((item) =>
                  new Date(item.fecha).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: 'Pedidos',
                    data: chartData.pedidosPorDia.map((item) => item.cantidad),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          )}
        </div> */}

        <div className='bg-white p-6 rounded-lg shadow-md flex justify-center'>
          <div className='w-[400px] h-[300px]'>
            <Line
              data={{
                labels: chartData?.pedidosPorDia?.length
                  ? chartData.pedidosPorDia.map((item) =>
                      new Date(item.fecha).toLocaleDateString()
                    )
                  : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [
                  {
                    label: 'Pedidos',
                    data: chartData?.pedidosPorDia?.length
                      ? chartData.pedidosPorDia.map((item) => item.cantidad)
                      : [3, 2, 5, 1, 0, 4, 2],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                ...lineChartOptions,
                maintainAspectRatio: false, // 👈 importante para que respete el alto del div
              }}
            />
          </div>
        </div>

        {/* Gráfico de barras - Productos más vendidos */}
        {/* <div className='bg-white p-6 rounded-lg shadow-md'>
          {chartData?.productosMasVendidos && (
            <Bar
              data={{
                labels: chartData.productosMasVendidos.map((item) =>
                  item.Producto.nombre.length > 15
                    ? item.Producto.nombre.substring(0, 15) + '...'
                    : item.Producto.nombre
                ),
                datasets: [
                  {
                    label: 'Cantidad Vendida',
                    data: chartData.productosMasVendidos.map(
                      (item) => item.totalVendido
                    ),
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                    ],
                  },
                ],
              }}
              options={barChartOptions}
            />
          )}
        </div> */}
        <div className='bg-white p-6 rounded-lg shadow-md flex justify-center'>
          <div className='w-[400px] h-[300px]'>
            <Bar
              data={{
                labels: chartData?.productosMasVendidos?.length
                  ? chartData.productosMasVendidos.map((item) =>
                      item.Producto.nombre.length > 15
                        ? item.Producto.nombre.substring(0, 15) + '...'
                        : item.Producto.nombre
                    )
                  : ['Silla', 'Mesa', 'Cuadro', 'Taza'],
                datasets: [
                  {
                    label: 'Cantidad Vendida',
                    data: chartData?.productosMasVendidos?.length
                      ? chartData.productosMasVendidos.map(
                          (item) => item.totalVendido
                        )
                      : [10, 5, 2, 8], // datos de muestra
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                    ],
                  },
                ],
              }}
              options={{
                ...barChartOptions,
                maintainAspectRatio: false, // 👈 importante
              }}
            />
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Gráfico circular - Ventas por categoría */}
        {/* <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold mb-4'>Ventas por Categoría</h3>
          {chartData?.ventasPorCategoria && (
            <Doughnut
              data={{
                labels: chartData.ventasPorCategoria.map(
                  (item) => item.Producto?.Categoria?.nombre || 'Sin categoría'
                ),
                datasets: [
                  {
                    data: chartData.ventasPorCategoria.map(
                      (item) => item.totalVendido
                    ),
                    backgroundColor: [
                      '#ef4444',
                      '#3b82f6',
                      '#22c55e',
                      '#a855f7',
                      '#f59e0b',
                      '#ec4899',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          )}
        </div> */}
        <div className='bg-white p-6 rounded-lg shadow-md flex justify-center'>
          <div className='w-[300px] h-[300px]'>
            <Doughnut
              data={{
                labels: chartData?.ventasPorCategoria?.length
                  ? chartData.ventasPorCategoria.map(
                      (item) =>
                        item.Producto?.Categoria?.nombre || 'Sin categoría'
                    )
                  : ['Categoría A', 'Categoría B', 'Categoría C'],
                datasets: [
                  {
                    data: chartData?.ventasPorCategoria?.length
                      ? chartData.ventasPorCategoria.map(
                          (item) => item.totalVendido
                        )
                      : [30, 15, 20], // datos de muestra
                    backgroundColor: ['#ef4444', '#3b82f6', '#22c55e'],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false, // 👈 esto evita que ocupe todo
                plugins: {
                  legend: { position: 'bottom' },
                },
              }}
            />
          </div>
        </div>

        {/* Actividad reciente */}
        {/* <div className='bg-white p-6 rounded-lg shadow-md lg:col-span-2'>
          <h3 className='text-lg font-semibold mb-4'>Actividad Reciente</h3>
          <div className='space-y-4'>
            {actividad?.pedidosRecientes?.slice(0, 5).map((pedido) => (
              <div
                key={pedido.id}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                    <ShoppingCart className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>
                      Nuevo pedido #{pedido.id}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {pedido.Cliente?.nombre} {pedido.Cliente?.apellido}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-gray-900'>
                    ${pedido.total?.toLocaleString() || '0'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {new Date(pedido.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        {/* Actividad reciente */}
        <div className='bg-white p-6 rounded-lg shadow-md lg:col-span-2'>
          <h3 className='text-lg font-semibold mb-4'>Actividad Reciente</h3>
          <div className='space-y-4'>
            {actividad?.pedidosRecientes?.length > 0 ? (
              actividad.pedidosRecientes.slice(0, 5).map((pedido) => (
                <div
                  key={pedido.id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                  <div className='flex items-center'>
                    <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                      <ShoppingCart className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        Nuevo pedido #{pedido.id}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {pedido.Cliente?.nombre} {pedido.Cliente?.apellido}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-gray-900'>
                      ${pedido.total?.toLocaleString() || '0'}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 italic'>No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
