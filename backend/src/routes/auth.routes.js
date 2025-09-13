import { Router } from 'express';
import {
  registerCliente,
  loginCliente,
  loginAdmin,
  refreshToken,
} from '../controllers/auth.controller.js';


const router = Router();

// ====== Rutas de CLIENTES (públicas en el sitio) ======
router.post('/clientes/register', registerCliente);
router.post('/clientes/login', loginCliente);

// ====== Rutas de ADMINISTRADORES/DISEÑADORES (ruta separada) ======
router.post('/admin/login', loginAdmin);

// ====== Rutas comunes ======
router.post('/refresh', refreshToken);

export default router;
