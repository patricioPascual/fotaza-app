import express from 'express';
import { getNotificaciones } from '../controller/notificacionController.js';

const router = express.Router();

router.get('/', getNotificaciones);

export default router;