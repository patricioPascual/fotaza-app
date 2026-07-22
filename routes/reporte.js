import express from 'express';
import { crearReporte, bajarPublicacion,
         getReportesComentariosPropios,
         borrarComentarioAutor,
         desestrimarReportes,
         desestimarReporteComentario,
         getPublicacionesEnRevision } from '../controller/reporteController.js';
import { requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/',  crearReporte);
router.get('/admin/revisiones', requireAdmin, getPublicacionesEnRevision);
router.post('/admin/:idpublicacion/bajar', requireAdmin, bajarPublicacion);
router.post('/admin/:idpublicacion/desestimar', requireAdmin, desestrimarReportes);
router.get('/mis-comentarios', getReportesComentariosPropios);
router.post('/comentarios/:idComentario/borrar', borrarComentarioAutor);
router.post('/comentarios/:idReporte/desestimar', desestimarReporteComentario);

export default router;