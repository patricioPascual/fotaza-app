import express from 'express';
import { cerrarComentarios,abrirComentarios, subirFotoPerfil, aplicarMarcaAgua,getEstadoFoto} from '../controller/fotoController.js';
import { expresarInteres } from '../controller/notificacionController.js';

const router = express.Router();


router.get('/:idfoto/estado', getEstadoFoto);
router.post('/:idfoto/cerrarComentarios', cerrarComentarios);
router.post('/:idfoto/abrirComentarios', abrirComentarios);
router.post('/:idfoto/interes', expresarInteres);

export default router;