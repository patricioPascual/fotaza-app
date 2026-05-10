import { Router } from 'express';
import { registrarUsuario } from '../controller/usuarioController.js';

const router = Router();


router.get('/registro', (req, res) => {
    res.render('registro'); 
});


router.post('/registro', registrarUsuario); 

export default router;