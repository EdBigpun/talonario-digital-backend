// src/controllers/facturasController.js
import { bucket } from "../config/firebase.js";
import { PDFDocument } from "pdf-lib";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";
import fs from "fs";

// Importar los modelos necesarios
import {
  crearFactura,
  listarFacturas,
  obtenerFacturaPorId,
  eliminarFactura,
  actualizarFactura,
} from "../models/facturasModel.js";

// Obtener lista de facturas
export const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await listarFacturas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo facturas" });
  }
};

// Agregar una factura (sin PDF)
export const agregarFactura = async (req, res) => {
  try {
    const factura = await crearFactura(req.body);
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: "Error agregando factura" });
  }
};

// Generar y subir factura a Firebase
export const generarFactura = async (req, res) => {
  const { clienteId, nombreCliente, monto, fecha } = req.body;

  try {
    // Ruta de la plantilla en la carpeta "public"
    const plantillaPath = path.join(
      process.cwd(),
      "src",
      "public",
      "plantillaFactura.pdf"
    );

    console.log(" Buscando plantilla en:", plantillaPath);

    // Verificar que el archivo existe
    if (!fs.existsSync(plantillaPath)) {
      console.error(
        "❌ Error: Plantilla de factura no encontrada en:",
        plantillaPath
      );
      return res
        .status(500)
        .json({ error: "Plantilla de factura no encontrada." });
    }

    // Cargar plantilla y modificarla
    const existingPdfBytes = fs.readFileSync(plantillaPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Insertar datos en la factura
    firstPage.drawText(`Cliente: ${nombreCliente}`, {
      x: 50,
      y: 700,
      size: 12,
    });
    firstPage.drawText(`Fecha: ${fecha}`, { x: 50, y: 680, size: 12 });
    firstPage.drawText(`Monto: $${monto}`, { x: 50, y: 660, size: 12 });

    // Guardar nuevo PDF en memoria
    const pdfBytes = await pdfDoc.save();

    // Generar nombre único para la factura
    const newFileName = `facturas/factura-${uuidv4()}.pdf`;
    const file = bucket.file(newFileName);

    console.log(" Subiendo archivo:", newFileName, "al bucket:", bucket.name);

    // Subir el archivo a Firebase Storage
    await file.save(pdfBytes, { contentType: "application/pdf" });

    // Hacer público el archivo
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFileName}`;

    console.log(" Archivo subido con URL:", publicUrl);

    // Verificar que clienteId existe antes de insertar en la base de datos
    if (!clienteId) {
      return res
        .status(400)
        .json({ error: "El campo clienteId es obligatorio." });
    }

    // Guardar la factura en la base de datos
    await pool.query(
      "INSERT INTO facturas (cliente_id, archivo_url, total, fecha_emision) VALUES ($1, $2, $3, $4)",
      [clienteId, publicUrl, monto, fecha]
    );

    res.json({ message: "Factura generada con éxito", url: publicUrl });
  } catch (error) {
    console.error("❌ Error al generar la factura:", error);
    res.status(500).json({ error: "Error al generar factura" });
  }
};
