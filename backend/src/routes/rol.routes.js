import express from "express";
import {
  getRoles,
  getRol,
  createRol,
  updateRol,
  deleteRol,
} from "../controllers/rol.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  validatePagination,
  validateRolCreate,
  validateRolUpdate,
  validateRolId,
} from "../middlewares/validation.js";

const router = express.Router();

// Listar roles
router.get("/", protect, authorize("ADMIN"), validatePagination, getRoles);

// Obtener un rol por ID
router.get("/:id", protect, authorize("ADMIN"), validateRolId, getRol);

// Crear rol
router.post("/", protect, authorize("ADMIN"), validateRolCreate, createRol);

// Actualizar rol
router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateRolId,
  validateRolUpdate,
  updateRol
);

// Eliminar rol
router.delete("/:id", protect, authorize("ADMIN"), validateRolId, deleteRol);

export default router;
