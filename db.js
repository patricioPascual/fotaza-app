import {Client} from 'pg'
import "dotenv/config";

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function conectar(){
  try{
    await client.connect();
    console.log("Conectado con exito ")

  }catch(error){
    console.log("Error al conectar con la Base de Datos ", error.message);
  }
}
conectar();

export { client };