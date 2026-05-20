import express from 'express';
import {subirFotoPerfil } from '../controller/fotoController.js';

const router = express.Router();

router.get('/', (req,res)=>{
    res.render('perfil')
});
router.post('/subir-foto', subirFotoPerfil);


export default router;