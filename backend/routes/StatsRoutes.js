import express from "express";
import { processBibliography } from "../services/StatsService.js";
import { db, bucket } from "../firebaseConfig.js";

const router = express.Router();

// Creates the related works from the statsService 
router.post("/processBib", async (req, res) => {
    try {
        const { fileName, userId, firstName, middleName, lastName } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await processBibliography(fileName, userId, firstName, middleName, lastName);

        // Check if papers array is empty
        if (!finalData.papers || finalData.papers.length === 0) {
            await db.ref(`users/${userId}/data/${fileName}`).remove();  // Deletes the file ref in from Firebase realtime

            const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);
            await fileRef.delete();  // Deletes the file from Firebase Storage

            return res.status(401).json({ error: "Unsuccessful parsing: No papers found in the bibliography." });
        }

        res.json(finalData);
    } catch (error) {
        console.error("Error processing bibliography:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// Fetches stats from the realtime Firebase db
router.get("/getProcessedBib", async (req, res) => {
    try {
        const { fileName, userId } = req.query;

        if (!fileName || !userId) {
            return res.status(400).json({ error: "fileName and userId are required"});

        }

        const snapshot = await db.ref(`users/${userId}/data/${fileName}/processedBib`).once("value");
        const storedData = snapshot.val();

        if (!storedData) {
            return res.status(404).json(null);
        }

        res.json(storedData);
    } catch (error) {
        console.error("Error fetching stored data:", error);
        res.status(500).json({error: "Failed to retrieve stored data"})
    }

});


export default router;