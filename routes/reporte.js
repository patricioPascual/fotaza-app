import express from 'express';
import { crearReporte, bajarPublicacion, desestrimarReportes, getPublicacionesEnRevision } from '../controller/reporteController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', requireAuth, crearReporte);
router.get('/admin/revisiones', requireAdmin, getPublicacionesEnRevision);
router.post('/admin/:idpublicacion/bajar', requireAdmin, bajarPublicacion);
router.post('/admin/:idpublicacion/desestimar', requireAdmin, desestrimarReportes);

export default router;