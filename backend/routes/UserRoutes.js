import express from "express";
import { bucket, db } from "../firebaseConfig.js";

const router = express.Router();


router.post("/name", async (req, res) => {
  try {
    // Expect the UID to be sent from the client
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // Fetch user data from Realtime Database
    const userSnapshot = await db.ref(`/users/${uid}`).once("value");
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract first and last name
    const { firstName, middleName, lastName } = userData;

    res.status(200).json({ firstName, middleName, lastName });
  } catch (error) {
    console.error("Error fetching user name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/files", async (req, res) => {
  try {
    // Expect the UID to be sent from the client
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // Fetch user data from Firebase Realtime Database
    const userSnapshot = await db.ref(`/users/${uid}`).once("value");
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the file names from the `data` field if it exists
    const fileNames = userData.data ? Object.keys(userData.data) : [];
    const filesWithLinks = [];

    // Fetch download URLs and upload dates for each file
    for (const fileName of fileNames) {

      const fileData = userData.data[fileName];
      const rawDate = fileData.metadata.uploadedAt;
      const uploadDate = new Date(rawDate).toLocaleString();
      
      const name = fileData.metadata.originalFileName;
    
      const filePath = `users/${uid}/uploads/${fileName}`; // Adjust as per your storage structure
      const file = bucket.file(filePath);

      // Check if file exists
      const [exists] = await file.exists();
      if (exists) {
        // Generate a signed URL for the file
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Link expires in 7 days
        });

        filesWithLinks.push({
          fileName,
          ogName: name,
          downloadUrl: url,
          uploadDate: uploadDate,
        });
      } else {
        filesWithLinks.push({
          fileName,
          ogName: name,
          downloadUrl: null, // Indicate that the file doesn't have a valid link
          uploadDate: uploadDate,
        });
      }
    }

    res.status(200).json({ files: filesWithLinks });

  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  

export default router;
