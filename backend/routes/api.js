import express from "express";
// import { storage } from "../firebaseAdmin.js"; // Import the initialized storage
// import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Firebase Admin SDK
import { generate } from "../cds_generator/generate.js"; // Your existing parsing logic

const router = express.Router();

// router.post("/get-cds")


router.post("/get-cds", async (req, res) => {
  // const { userId, fileName } = req.body;
  // if (!userId || !fileName) {
  //   return res.status(400).json({ error: "User ID and file name are required" });
  // }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID are required" });
  }

  try {
    const response = await generate(userId)
    res.status(200).json({ response });

  } catch (error) {
    console.error("Error in /api/parse-file:", error);
    res.status(500).json({ error: "Failed to parse the file" });
  }
});

export default router;

