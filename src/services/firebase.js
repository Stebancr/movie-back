// src/services/firebase.js
import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Cargar credenciales
const serviceAccount = JSON.parse(
  await readFile(new URL("../../serviceAccountKey.json", import.meta.url))
);

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
