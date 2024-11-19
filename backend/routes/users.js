import express from "express";
import admin from "firebase-admin";
import { db } from "../firebase.js";

const router = express.Router();


// // POST route to verify Firebase token
// router.post("/user-auth", async (req, res) => {
//   const { token } = req.body;
//   try {
//     // Verify the token
//     const decodedToken = await admin.auth().verifyIdToken(token);

//     // Extract user ID and other info from token
//     const userId = decodedToken.uid;
//     console.log("Verified user ID:", userId);

//     // Respond with user details
//     res.status(200).json({ userId });
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     res.status(401).json({ error: "Unauthorized" });
//   }
// });


router.post("/get-user-id", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Extract user ID
    const userId = decodedToken.uid;
    res.status(200).json({ userId });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});


export default router;