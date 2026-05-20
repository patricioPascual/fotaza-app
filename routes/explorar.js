import { Router } from 'express';
import {traerPublicacionesByTag, 
        traerPublicacionesByUser,
       procesarBusqueda} from '../controller/publicacionController.js';


const router = Router();


router.get('/',(req,res)=>{
  res.render('explorar')
})
router.post('/', procesarBusqueda); 
router.get('/usuario/:nombreUsuario', traerPublicacionesByUser);
router.get('/etiqueta/:etiqueta', traerPublicacionesByTag);

export default router;