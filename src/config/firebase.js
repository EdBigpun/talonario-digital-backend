import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync, existsSync } from "fs";
import path from "path";

dotenv.config();

// Ruta del archivo de credenciales
const serviceAccountPath = path.join(process.cwd(), "firebaseKey.json");

// Verificar si el archivo de credenciales existe
if (!existsSync(serviceAccountPath)) {
  console.error(
    "❌ Error: No se encontró firebaseKey.json en:",
    serviceAccountPath
  );
  process.exit(1);
}

// Cargar credenciales
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
} catch (error) {
  console.error("❌ Error al leer firebaseKey.json:", error);
  process.exit(1);
}

// Verificar que la variable de entorno FIREBASE_BUCKET esté definida
if (!process.env.FIREBASE_BUCKET) {
  console.error(
    "❌ Error: La variable de entorno FIREBASE_BUCKET no está definida en el .env"
  );
  process.exit(1);
}

// Inicializar Firebase solo si no ha sido inicializado
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_BUCKET,
    });
    console.log("✅ Firebase inicializado correctamente.");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
    process.exit(1);
  }
}

// Exportar el bucket para su uso en almacenamiento
export const bucket = admin.storage().bucket();
export default admin;
