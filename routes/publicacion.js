import express from 'express';
import { crearPublicacion ,traerAllPublicaciones,traerPublicacionesDeSeguidos} from '../controller/publicacionController.js';

const router = express.Router();


router.get('/siguiendo', traerPublicacionesDeSeguidos);
router.get('/index', traerAllPublicaciones);
router.post('/publicar', crearPublicacion);


export default router;