import express from "express";
import { processBibliography } from "../services/StatsService.js";
import { db } from "../firebaseConfig.js";

const router = express.Router();

// Creates the related works from the statsService 
router.post("/processBib", async (req, res) => {
    try {
        const { fileName, userId, firstName, middleName, lastName } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await processBibliography(fileName, userId, firstName, middleName, lastName);
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