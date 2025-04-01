import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Crear la conexión a NeonDB usando DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

//  PRUEBA FINAL DE CONEXIÓN (Mejorada)
async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conexión exitosa a NeonDB:", res.rows[0].now);
  } catch (err) {
    console.error("❌ Error conectando a NeonDB:", err);
    process.exit(1); // Detener la aplicación si la conexión falla
  }
}

testConnection(); // Ejecutar la prueba al inicio

export default pool;
