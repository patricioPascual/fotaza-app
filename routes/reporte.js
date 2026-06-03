import express from 'express';
import { crearReporte } from '../controller/reporteController.js';

const router = express.Router();

router.post('/', crearReporte);

export default router;