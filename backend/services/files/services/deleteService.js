import { db, bucket } from "../../../utils/firebaseConfig.js";

export const deleteUserFile = async (userId, fileName) => {
  if (!fileName || !userId) {
    throw new Error("fileName and userId are required");
  }

  const refPath = `users/${userId}/data/${fileName}`;
  const snapshot = await db.ref(refPath).once("value");

  if (!snapshot.exists()) {
    const error = new Error("File not found in database");
    error.status = 404;
    throw error;
  }

  // Delete from Firebase Realtime Database
  await db.ref(refPath).remove();

  // Delete from Firebase Storage
  const storagePath = `users/${userId}/uploads/${fileName}`;
  try {
    await bucket.file(storagePath).delete();
    console.log(`Deleted file from Firebase Storage: ${storagePath}`);
  } catch (err) {
    console.warn("Warning: Failed to delete from Firebase Storage", err.message);
  }

  return { message: "File successfully deleted from database and storage." };
};