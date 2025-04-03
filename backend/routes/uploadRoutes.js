import express from "express";
import multer from "multer";
import { uploadFileToFirebase } from "../services/uploadService.js";
import { db, bucket } from "../firebaseConfig.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "Missing user ID" });
        }

        const normalizedFileName = req.file.originalname.replace(/\./g, "_");
        const storagePath = `users/${userId}/uploads/${normalizedFileName}`;

        const [files] = await bucket.getFiles({ prefix: storagePath });
        const alreadyExists = files.some(file => file.name === storagePath);
        if (alreadyExists) {
            return res.status(409).json({ error: "A file with this name already exists." });
        }

        const { fileName, downloadURL } = await uploadFileToFirebase(req.file, userId);
        res.json({ message: "File uploaded successfully", fileName, downloadURL });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
});

router.delete("/delete-file", async (req, res) => {
    try {
        const { fileName, userId } = req.query;

        if (!fileName || !userId) {
            return res.status(400).json({ error: "fileName and userId are required"});

        }

        const refPath = `users/${userId}/data/${fileName}`;
        const snapshot = await db.ref(refPath).once("value");
    
        if (!snapshot.exists()) {
          return res.status(404).json({ error: "File not found in database" });
        }
    
        // Delete from Firebase Realtime Database
        await db.ref(refPath).remove();

        // delete from firebase storage
        const storagePath = `users/${userId}/uploads/${fileName}`;
        try {
            await bucket.file(storagePath).delete();
            console.log(`Deleted file from Firebase Storage: ${storagePath}`);
          } catch (err) {
            console.warn("Warning: Failed to delete from Firebase Storage", err.message);
          }

          return res.json({ message: "File successfully deleted from database and storage." });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({ error: "Failed to delete file" });
    }

});



export default router;