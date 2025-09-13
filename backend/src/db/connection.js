import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

// Extrae las variables de entorno
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT;
const dbPort = process.env.DB_PORT;

// Crea una instancia de Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  port: dbPort,
  logging: false, // Desactiva los logs SQL
});

// Exporta la instancia para usarla en otros lugares
export default sequelize;
