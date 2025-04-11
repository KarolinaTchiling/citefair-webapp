import express from "express";
import { getCds } from "../controllers/cdsController.js";

const router = express.Router();

router.get("/get-statements", getCds);

export default router;

