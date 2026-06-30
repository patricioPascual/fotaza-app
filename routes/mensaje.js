import express from 'express';
import { mostrarConversacion, enviarMensaje } from '../controller/mensajeController.js';



const router = express.Router();


router.get('/mensajes/:nombreDestino', mostrarConversacion);


router.post('/mensajes/enviar',  enviarMensaje);

export default router;