import { Router } from 'express';
import {
  loginCliente,
  loginAdmin,
  refreshToken,
  logout,
  registerCliente,
  perfil,
  requestPasswordReset,
  resetPassword,
  googleAuth,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerCliente);
router.post('/loginCliente', loginCliente);
router.post('/loginAdmin', loginAdmin);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/perfil', protect, perfil);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.post('/google', googleAuth);

export default router;
