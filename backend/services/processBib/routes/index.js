import express from "express";
import { processBib, getProcessedBib } from "../controllers/processBibController.js";

const router = express.Router();

router.post("/processBib", processBib);
router.get("/getProcessedBib", getProcessedBib);

export default router;
