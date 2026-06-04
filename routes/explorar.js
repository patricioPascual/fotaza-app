import { Router } from 'express';
import {traerPublicacionesByTag, 
        traerPublicacionesByUser,
       procesarBusqueda,
       buscarPublicacionesGeneral,
       busquedaCombinada} from '../controller/explorarController.js';


const router = Router();


router.get('/',(req,res)=>{
  res.render('explorar')
})
router.post('/', procesarBusqueda); 
router.get('/combinada',busquedaCombinada);
router.get('/buscar', buscarPublicacionesGeneral);
router.get('/usuario/:nombreUsuario', traerPublicacionesByUser);
router.get('/etiqueta/:etiqueta', traerPublicacionesByTag);

export default router;