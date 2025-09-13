import { Router } from 'express';
import {
  getDashboardMetrics,
  getDashboardCharts,
  getActividadReciente,
} from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

router.get('/metrics', getDashboardMetrics);
router.get('/charts', getDashboardCharts);
router.get('/actividad', getActividadReciente);

export default router;
