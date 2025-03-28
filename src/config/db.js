import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Crear la conexión a NeonDB usando DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 🔹 PRUEBA FINAL DE CONEXIÓN
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa a NeonDB:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error conectando a NeonDB:", err);
  }
})();

export default pool;
