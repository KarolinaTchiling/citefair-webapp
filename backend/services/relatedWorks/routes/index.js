import express from "express";
import { getRelatedWorks, relatedWorks } from "../controllers/relatedWorksController.js";

const router = express.Router();

router.post("/run-related-work", relatedWorks);
router.get("/get-related-work", getRelatedWorks);

export default router;

