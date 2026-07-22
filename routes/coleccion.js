import express from 'express';
import { agregarPublicacionACol ,verMisColecciones,verDetalleColeccion,eliminarColeccion,quitarPublicacionDeCol} from '../controller/coleccionController.js';

const router = express.Router();

router.get('/colecciones', verMisColecciones);
router.get('/colecciones/:id', verDetalleColeccion);
router.post('/colecciones/agregar', agregarPublicacionACol);
router.delete('/colecciones/:id', eliminarColeccion);
router.delete('/colecciones/:idColeccion/publicaciones/:idPublicacion', quitarPublicacionDeCol);
export default router;