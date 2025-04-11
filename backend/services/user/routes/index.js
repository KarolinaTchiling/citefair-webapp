import express from "express";
import { getUserName } from "../controllers/userController.js";

const router = express.Router();

router.post("/name", getUserName);

export default router;

