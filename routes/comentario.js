import express from 'express';
import { crearComentario, getComentariosFoto } from '../controller/comentarioController.js';

const router = express.Router();

router.get('/:idfoto', getComentariosFoto);
router.post('/', crearComentario);

export default router;