// src/models/facturasModel.js
import pool from "../config/db.js";

export const crearFactura = async (factura) => {
  try {
    const { cliente_id, archivo_url, total, fecha_emision } = factura;
    const result = await pool.query(
      "INSERT INTO facturas (cliente_id, archivo_url, total, fecha_emision) VALUES ($1, $2, $3, $4) RETURNING *",
      [cliente_id, archivo_url, total, fecha_emision]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creando factura:", error);
    throw error;
  }
};

export const listarFacturas = async () => {
  try {
    const result = await pool.query("SELECT * FROM facturas");
    return result.rows;
  } catch (error) {
    console.error("Error listando facturas:", error);
    throw error;
  }
};

export const obtenerFacturaPorId = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM facturas WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error obteniendo factura por ID:", error);
    throw error;
  }
};

export const eliminarFactura = async (id) => {
  try {
    const result = await pool.query("DELETE FROM facturas WHERE id = $1", [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error eliminando factura:", error);
    throw error;
  }
};

export const actualizarFactura = async (id, datos) => {
  try {
    const { cliente_id, archivo_url, total, fecha_emision } = datos;
    const result = await pool.query(
      "UPDATE facturas SET cliente_id = $1, archivo_url = $2, total = $3, fecha_emision = $4 WHERE id = $5 RETURNING *",
      [cliente_id, archivo_url, total, fecha_emision, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error actualizando factura:", error);
    throw error;
  }
};
