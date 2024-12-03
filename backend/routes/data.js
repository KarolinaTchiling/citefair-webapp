import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// Route to get data from the "test" node
router.get("/", async (req, res) => {
  try {
    const ref = db.ref("test");
    ref.once("value", (snapshot) => {
      res.json(snapshot.val());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data");
  }
});

export default router;