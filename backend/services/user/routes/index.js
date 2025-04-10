import express from "express";
import { getUserName, getUserFiles } from "../controllers/userController.js";

const router = express.Router();

router.post("/name", getUserName);
router.post("/files", getUserFiles);

export default router;
