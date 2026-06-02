import { Sequelize } from 'sequelize';
import "dotenv/config";
import pg from 'pg';

const sslConn= process.env.DB_SSL=='true'?{
  ssl:{
    required:true,
    rejectUnauthorized:false,
  }
}:undefined;

const sequelize = new Sequelize({
  dialect:'postgres',
  dialectModule: pg,
  dialectOptions: sslConn,

  database:process.env.DB_NAME,     
  username:process.env.DB_USER,     
  password:process.env.DB_PASSWORD, 
  
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
      
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