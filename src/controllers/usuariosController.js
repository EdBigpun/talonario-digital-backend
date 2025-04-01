// src/controllers/usuariosController.js
import {
  buscarPorEmail,
  crearUsuario,
  obtenerUsuarios as obtenerUsuariosModel, // Renombrar para evitar conflictos
} from "../models/usuariosModel.js";

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuariosModel(); // Usar la función renombrada
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

export const agregarUsuario = async (req, res) => {
  try {
    const usuario = await crearUsuario(req.body);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error agregando usuario" });
  }
};
