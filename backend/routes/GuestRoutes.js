import express from "express";
import { db } from "../config/firebaseConfig.js";

const router = express.Router();

router.post("/registerGuest", async (req, res) => {
  try {
    // Expect the guest UID to be sent from the client after sign-in
    const { uid, firstName, middleName, lastName } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    
    // Prepare guest user data
    const guestData = {
      uid,
      firstName,
      middleName,
      lastName,
      isGuest: true,
      createdAt: Date.now(),
    };

    // Write the guest data to the Realtime Database at /users/{uid}
    await db.ref(`/users/${uid}`).set(guestData);

    res.status(201).json({ message: "Guest registered successfully" });
  } catch (error) {
    console.error("Error registering guest:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/getUser", async (req, res) => {
//     try {
//         const { fileName, userId } = req.query;

//         if (!fileName || !userId) {
//             return res.status(400).json({ error: "fileName and userId are required"});

//         }

//         const snapshot = await db.ref(`users/${userId}/data/${fileName}`.once("value"));
//         const storedData = snapshot.val();

//         if (!storedData) {
//             return res.status(404).json(null);
//         }

//         res.json(storedData);
//     } catch (error) {
//         console.error("Error fetching stored data:", error);
//         res.status(500).json({error: "Failed to retrieve stored data"})
//     }

// });




export default router;
