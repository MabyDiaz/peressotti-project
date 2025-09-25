import { Router } from 'express';
import {
  loginCliente,
  loginAdmin,
  refreshToken,
  logout,
  registerCliente,
  perfil,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerCliente);
router.post('/loginCliente', loginCliente);
router.post('/loginAdmin', loginAdmin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/perfil', protect, perfil);

export default router;
