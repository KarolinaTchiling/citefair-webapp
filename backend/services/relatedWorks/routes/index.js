import express from "express";
import { getRelatedWorksController, relatedWorksController } from "../controllers/relatedWorksController.js";

const router = express.Router();

router.post("/run-related-work", relatedWorksController);
router.get("/get-related-work", getRelatedWorksController);

export default router;

