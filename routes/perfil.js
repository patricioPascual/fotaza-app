import express from 'express';
import {subirFotoPerfil } from '../controller/fotoController.js';
import { verPerfil } from '../controller/usuarioController.js';

const router = express.Router();

router.get('/', verPerfil);


router.post('/subir-foto', subirFotoPerfil);


export default router;