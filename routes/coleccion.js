import express from 'express';
import { agregarPublicacionACol ,verMisColecciones,verDetalleColeccion} from '../controller/coleccionController.js';

const router = express.Router();

router.get('/colecciones', verMisColecciones);
router.get('/colecciones/:id', verDetalleColeccion);
router.post('/colecciones/agregar', agregarPublicacionACol);

export default router;