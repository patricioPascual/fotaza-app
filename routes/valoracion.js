import express from 'express';
import { valorarFoto} from '../controller/valoracionController.js';

const router = express.Router();


router.post('/valorar', valorarFoto);

export default router;