import express from "express";
import multer from "multer";
import { uploadFileToFirebase } from "../services/uploadService.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/guest-upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "Missing user ID" });
        }

        const { fileName, downloadURL } = await uploadFileToFirebase(req.file, userId);
        res.json({ message: "File uploaded successfully", fileName, downloadURL });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "File upload failed" });
    }
});




export default router;