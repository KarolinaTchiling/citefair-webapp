import express from "express";
import { db, auth, bucket } from "../firebaseConfig.js";
import admin from "firebase-admin";

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

router.get("/isGuest", async (req, res) => {
  try {
    const { uid } = req.query; // ✅ Get `uid` from query params

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // Fetch user data from Firebase Realtime Database
    const userSnapshot = await db.ref(`/users/${uid}`).once("value");
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is a guest (defaults to false if not set)
    const isGuest = userData.isGuest ?? false;

    res.status(200).json({ isGuest });

  } catch (error) {
    console.error("Error checking guest status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/save-guest", async (req, res) => {
  try {
    const { uid, email, password } = req.body;
    
    if (!uid || !email || !password) {
      return res.status(400).json({ error: "UID, email, and password are required" });
    }

    // Fetch guest user data from Realtime Database
    const userSnapshot = await db.ref(`/users/${uid}`).once("value");
    const userData = userSnapshot.val();

    if (!userData || !userData.isGuest) {
      return res.status(400).json({ error: "User is not a guest or does not exist" });
    }

    // Upgrade guest user in Firebase Authentication (Admin SDK)
    await admin.auth().updateUser(uid, {
      email: email,
      password: password,
    });

    // Update Firebase Realtime Database (Mark user as non-guest)
    await db.ref(`/users/${uid}`).update({
      email,
      isGuest: false,
    });

    res.status(200).json({ message: "Guest account upgraded successfully" });

  } catch (error) {
    console.error("Error upgrading guest account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.delete("/deleteGuest", async (req, res) => {
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    res.status(200).json({ message: "Guest session deleted successfully" });

  } catch (error) {
    console.error("Error deleting guest session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




export default router;
