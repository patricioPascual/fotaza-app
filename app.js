import express from 'express';
import { client } from './db.js'; 
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;


async function pruebaDeCOnexion(){
   try {
        
        const res = await client.query('SELECT NOW() as hora');
        console.log("Conexión OK Hora en DB:", res.rows[0].hora);
    } catch (error) {
        console.error("Error de con", error.message);
    }
};




pruebaDeCOnexion();

app.listen(PORT);