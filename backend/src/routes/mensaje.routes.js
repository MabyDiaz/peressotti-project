import express from 'express';
import {
  obtenerMensajesPorproducto,
  crearMensaje,
} from '../controllers/mensaje.controller.js';

const router = express.Router();

router.get('/productos/:id/mensajes', obtenerMensajesPorproducto);
router.post('/productos/:id/mensajes', crearMensaje);

export default router;
