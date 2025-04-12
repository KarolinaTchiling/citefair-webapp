import express from "express";
import { getCdsController, addCdsReferencesController } from "../controllers/cdsController.js";

const router = express.Router();

router.get("/get-statements", getCdsController);
router.get("/add-cds-references", addCdsReferencesController );

export default router;

