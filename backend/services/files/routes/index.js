import express from "express";
import multer from "multer";
import { handleFileUpload, handleFileDelete, handleFetchUserFiles } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer(); // uses memo`ry storage

router.get("/get-files", handleFetchUserFiles);
router.post("/upload", upload.single("file"), handleFileUpload);
router.delete("/delete", handleFileDelete);

export default router;
