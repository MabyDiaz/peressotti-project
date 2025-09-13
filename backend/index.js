import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './src/middlewares/errorHandler.js';
import sequelize from './src/db/connection.js'; // Importa la instancia

//Importar rutas
import routerPrincipal from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', 'http://localhost:3000'],
      },
    },
  })
);

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',
];

// Configuración CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (Postman, curl) o si el origin está en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    credentials: true, // necesario para enviar cookies o token
  })
);

// Manejar preflight OPTIONS
app.options(
  '*',
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Resource-Policy");
  next();
});
// Middleware para servir imágenes
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  },
  express.static(path.join(process.cwd(), 'uploads'))
);

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Middleware para parsear JSON / Parsing de datos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ruta de salud de la API
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Usar las rutas
app.use('/api', routerPrincipal);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicializar DB y levantar servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos en desarrollo:
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Modelos sincronizados con la base de datos.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📍 Ruta de salud: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
