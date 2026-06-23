import express from 'express';
import { crearPublicacion ,traerAllPublicaciones,
    traerPublicacionesDeSeguidos,
    traerPublicacionesPublicas} from '../controller/publicacionController.js';

const router = express.Router();


router.get('/publico', traerPublicacionesPublicas);
router.get('/siguiendo', traerPublicacionesDeSeguidos);
router.get('/index', traerAllPublicaciones);
router.post('/publicar', crearPublicacion);


export default router;