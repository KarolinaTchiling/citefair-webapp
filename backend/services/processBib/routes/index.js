import express from "express";
import { processBib, getProcessedBib } from "../controllers/processBibController.js";

const router = express.Router();

router.post("/run-process-bib", processBib);
router.get("/get-process-bib", getProcessedBib);

export default router;
