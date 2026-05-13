import { Router } from 'express';
import { registrarUsuario, autenticarUsuario } from '../controller/usuarioController.js';

const router = Router();


router.get('/registro', (req, res) => {
    res.render('registro'); 
});


router.post('/registro', registrarUsuario); 
router.post('/login',autenticarUsuario);
export default router;