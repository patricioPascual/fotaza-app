import express from 'express';
import { crearPublicacion } from '../controller/publicacionController.js';

const router = express.Router();


router.post('/publicar', crearPublicacion);

export default router;