import admin from "firebase-admin";

import fs from "fs";
import "dotenv/config";

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// Export database references
const db = admin.database();
const bucket = admin.storage().bucket();

export { db, bucket ,admin};

