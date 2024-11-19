import express from "express";
import { storage } from "../firebaseAdmin.js"; // Import the initialized storage
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Firebase Admin SDK
import { parseBibContent } from "../cds/parseBib.js"; // Your existing parsing logic

const router = express.Router();

router.post("/parse-file", async (req, res) => {
  const { userId, fileName } = req.body;

  if (!userId || !fileName) {
    return res.status(400).json({ error: "User ID and file name are required" });
  }

  try {
    // Use Firebase Storage to retrieve the file
    const filePath = `users/${userId}/uploads/ref.bib`;
    const bucket = storage.bucket();
    const file = bucket.file(filePath);

    console.log(filePath)
    // Step 2: Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: "File not found in Firebase Storage" });
    }
    // Step 3: Download the file content
    const [fileContent] = await file.download(); // This defines fileContent

    // Parse the file content
    const parsedResult = parseBibContent(fileContent.toString("utf-8"));
    console.log("Parsed Result:", parsedResult);

    res.status(200).json({ parsedResult });
  } catch (error) {
    console.error("Error in /api/parse-file:", error);
    res.status(500).json({ error: "Failed to parse the file" });
  }
});

export default router;

