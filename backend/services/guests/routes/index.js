import express from "express";
import {
  registerGuestController,
  isGuestController,
  saveGuestController,
  deleteGuestController,
} from "../controllers/guestController.js";

const router = express.Router();

router.post("/register", registerGuestController);
router.get("/is-guest", isGuestController);
router.post("/save", saveGuestController);
router.delete("/delete", deleteGuestController);

export default router;