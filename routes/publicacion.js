import express from 'express';
import { crearPublicacion ,traerAllPublicaciones,
    traerPublicacionesDeSeguidos,
    traerPublicacionesPublicas,
    editarPublicacion,
    eliminarPublicacion} from '../controller/publicacionController.js';

const router = express.Router();


router.get('/publico', traerPublicacionesPublicas);
router.get('/siguiendo', traerPublicacionesDeSeguidos);
router.get('/index', traerAllPublicaciones);
router.post('/publicar', crearPublicacion);
router.post('/publicaciones/:idpublicacion/editar', editarPublicacion);
router.post('/publicaciones/:idpublicacion/eliminar', eliminarPublicacion);

export default router;