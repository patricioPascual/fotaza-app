import express from 'express';
import {subirFotoPerfil } from '../controller/fotoController.js';
import { verPerfil , seguirUsuario,dejarDeSeguir} from '../controller/usuarioController.js';

const router = express.Router();

router.get('/', verPerfil);
router.get('/:nombreUsuario', verPerfil);

router.post('/:nombreUsuario/seguir', seguirUsuario);
router.post('/:nombreUsuario/dejarSeguir', dejarDeSeguir);
router.post('/subir-foto', subirFotoPerfil);


export default router;