import { Router } from "express";
import { obtenerUsuarios, agregarUsuario, } from "../controllers/usuariosController.js";

const router = Router();

router.get("/", obtenerUsuarios);
router.post("/", agregarUsuario);

export default router;
