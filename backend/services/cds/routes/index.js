import express from "express";
import { getCdsController } from "../controllers/cdsController.js";

const router = express.Router();

router.get("/get-statements", getCdsController);

export default router;

