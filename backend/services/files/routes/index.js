import express from "express";
import multer from "multer";
import { FetchUserFilesController, FileUploadController, FileDeleteController } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer(); // uses memory storage

router.get("/get-files", FetchUserFilesController);
router.post("/upload", upload.single("file"), FileUploadController);
router.delete("/delete", FileDeleteController);

export default router;
