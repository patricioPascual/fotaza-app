import { Router } from 'express';
import { registrarUsuario, autenticarUsuario ,logout} from '../controller/usuarioController.js';

const router = Router();



router.get('/logout', logout);
router.get('/registro', (req, res) => {
    res.render('registro'); 
});


router.post('/auth/registro', registrarUsuario); 
router.post('/login',autenticarUsuario);
export default router;