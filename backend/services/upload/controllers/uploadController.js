import { uploadFileToFirebase } from "../services/uploadService.js";
import { bucket } from "../../../utils/firebaseConfig.js";

// Handles file upload requests
export const handleFileUpload = async (req, res) => {
    try {
      const userId = req.user?.uid; // from Firebase token
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      if (!userId) {
        return res.status(401).json({ error: "Missing user ID (unauthenticated)" });
      }
  
      const normalizedFileName = file.originalname.replace(/[.#$/[\]]/g, "_");
      const storagePath = `users/${userId}/uploads/${normalizedFileName}`;
  
      // Check if file already exists in Firebase Storage
      const [files] = await bucket.getFiles({ prefix: storagePath });
      const alreadyExists = files.some(f => f.name === storagePath);
  
      if (alreadyExists) {
        return res.status(409).json({ error: "A file with this name already exists." });
      }
  
      // Upload and return data
      const { fileName, downloadURL } = await uploadFileToFirebase(file, userId);
      return res.status(200).json({
        message: "File uploaded successfully",
        fileName,
        downloadURL,
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "File upload failed" });
    }
  };
