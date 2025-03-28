import { Router } from "express";
import { obtenerClientes, agregarCliente, } from "../controllers/clientesController.js";

const router = Router();

router.get("/", obtenerClientes);
router.post("/", agregarCliente);

export default router;
