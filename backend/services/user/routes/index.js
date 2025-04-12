import express from "express";
import { getUserNameController } from "../controllers/userController.js";

const router = express.Router();

router.post("/name", getUserNameController);

export default router;

