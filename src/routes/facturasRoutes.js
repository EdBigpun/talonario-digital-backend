import { Router } from "express";
import { obtenerFacturas, agregarFactura, generarFactura, } from "../controllers/facturasController.js"; // ✅ Agregado generarFactura

const router = Router();

router.get("/", obtenerFacturas);
router.post("/", agregarFactura);
router.post("/generar", generarFactura); // ✅ Ruta funcionando correctamente

export default router;
