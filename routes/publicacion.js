import express from 'express';
import { crearPublicacion ,traerAllPublicaciones} from '../controller/publicacionController.js';

const router = express.Router();

router.get('/index', traerAllPublicaciones);
router.post('/publicar', crearPublicacion);

export default router;