import { resolve } from "path";
import { fileURLToPath } from "url";
import { db, storage } from "../firebase.js"; // Adjust this path as needed

// Resolve __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename);

console.log("Testing Firebase:");

(async function testFirebase() {
  try {
    console.log("DB instance:", db ? "Initialized" : "Not initialized");
    console.log("Storage instance:", storage ? "Initialized" : "Not initialized");

    // Test database connection
    const testRef = db.ref("users");
    const snapshot = await testRef.once("value");
    console.log("Test DB value:", snapshot.val());

    // Test storage bucket
    const bucket = storage.bucket();
    console.log("Storage Bucket Name:", bucket.name);
  } catch (error) {
    console.error("Error testing Firebase setup:", error);
  }
})();