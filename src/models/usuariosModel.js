// src/models/usuariosModel.js
import pool from "../config/db.js";

export const buscarPorEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error buscando usuario por email:", error);
    throw error;
  }
};

export const crearUsuario = async (usuario) => {
  try {
    const { nombre, email, password } = usuario;
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING *",
      [nombre, email, password]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
};

export const obtenerUsuarios = async () => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    throw error;
  }
};
