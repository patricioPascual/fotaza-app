import { Sequelize } from 'sequelize';
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_NAME,     
  process.env.DB_USER,     
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',   
    logging: false,        
  }
);

try {
  await sequelize.authenticate();
  console.log(' Conexion realizada');
} catch (error) {
  console.error('Error en conexion a la DB', error);
}

export default sequelize;