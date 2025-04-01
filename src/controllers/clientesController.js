import pool from "../config/db.js";

export const obtenerClientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    res.status(500).json({ error: "Error obteniendo clientes" });
  }
};

export const agregarCliente = async (req, res) => {
  try {
    const { nombre, email, direccion } = req.body;
    const result = await pool.query(
      "INSERT INTO clientes (nombre, email, direccion) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, direccion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error agregando cliente:", error);
    res.status(500).json({ error: "Error agregando cliente" });
  }
};
