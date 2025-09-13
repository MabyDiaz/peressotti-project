import dotenv from 'dotenv';
import { sequelize } from '../src/models/index.js';

dotenv.config();

const syncDatabase = async () => {
  try {
    console.log('🔄 Sincronizando base de datos...');

    await sequelize.authenticate();
    console.log('✅ Conexión a DB establecida');

    // Sincronizar modelos (sin borrar datos)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados exitosamente');

    console.log('🎉 Sincronización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
    process.exit(1);
  }
};

syncDatabase();
