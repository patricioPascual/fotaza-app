import express from 'express';
import { traerPublicacionesPublicas } from '../controller/publicacionController.js';

const router = express.Router();
router.get('/', traerPublicacionesPublicas);
export default router;