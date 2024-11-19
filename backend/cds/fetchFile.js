import path from "path";
import { fileURLToPath } from "url";
import { storage } from "../firebaseAdmin.js";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fetch a file from Firebase Storage
export async function fetchFileFromFirebase(userId, fileName) {
  try {
    const filePath = `users/${userId}/uploads/${fileName}`;
    const bucket = storage.bucket(); 
    const file = bucket.file(filePath);

    const [contents] = await file.download();
    return contents.toString("utf-8"); // Convert to string
  } catch (error) {
    console.error("Error fetching file from Firebase:", error);
    throw error;
  }
}