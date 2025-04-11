import express from "express";
import multer from "multer";
import { handleFileUpload } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer(); // uses memo`ry storage

router.post("/", upload.single("file"), handleFileUpload);

export default router;
