import express from "express";
import { processBibController, getProcessedBibController } from "../controllers/processBibController.js";

const router = express.Router();

router.post("/run-process-bib", processBibController);
router.get("/get-process-bib", getProcessedBibController);

export default router;
