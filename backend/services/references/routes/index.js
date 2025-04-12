import express from "express";
import {
    getReferencesController,
    addReferenceController,
    deleteReferenceController,
    downloadReferencesController,
} from "../controllers/referencesController.js";

const router = express.Router();

router.get("/get-all", getReferencesController);
router.post("/add", addReferenceController);
router.delete("/delete", deleteReferenceController);
router.post("/download", downloadReferencesController);

export default router;