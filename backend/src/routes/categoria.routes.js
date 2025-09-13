import { Router } from 'express';
import {
  getCategorias,
  getCategoria,
  getProductosByCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../controllers/categoria.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import {
  validateCategoriaCreate,
  validateCategoriaUpdate,
  validateCategoriaId,
  validatePagination,
} from '../middlewares/validation.js';
import multer from 'multer';

// Configuración básica de multer
const upload = multer({
  dest: 'uploads/', // carpeta donde se guardarán temporalmente los archivos
  limits: { fileSize: 5 * 1024 * 1024 }, // límite 5MB
});

const router = Router();

// ============================
// Rutas públicas
// ============================

// Obtener todas las categorías (con filtros, search, paginación)
router.get('/', validatePagination, getCategorias);

// Obtener una categoría por ID
router.get('/:id', validateCategoriaId, getCategoria);

// Obtener productos de una categoría
router.get(
  '/:id/productos',
  validateCategoriaId,
  validatePagination,
  getProductosByCategoria
);

// ============================
// Rutas protegidas (solo ADMIN)
// ============================

// Crear nueva categoría
router.post(
  '/',
  protect,
  authorize('ADMIN'),
  upload.single('imagenURL'),
  validateCategoriaCreate,
  createCategoria
);

// Actualizar categoría
router.put(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateCategoriaId,
  validateCategoriaUpdate,
  updateCategoria
);

// Eliminar categoría
router.delete(
  '/:id',
  protect,
  authorize('ADMIN'),
  validateCategoriaId,
  deleteCategoria
);

export default router;
