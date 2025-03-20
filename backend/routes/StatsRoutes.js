import express from "express";
import { processBibliography } from "../services/StatsService.js";
import { db, bucket } from "../firebaseConfig.js";

const router = express.Router();

// Creates the related works from the statsService 
router.post("/processBib", async (req, res) => {
    try {
        const { fileName, userId, firstName, middleName, lastName } = req.body;

        if (!fileName || !userId) {
            return res.status(400).json({ error: "fileName and userId are required" });
        }

        // check if file exists 
        const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);
        try {
            await fileRef.getMetadata(); // Attempt to retrieve metadata (if file exists)
        } catch (error) {
            if (error.code === 404) { // Firebase Storage returns a 404 error if file is missing
                return res.status(404).json({ error: "File does not exist. Please upload the file first." });
            }
            throw error; // Other errors should be handled as internal errors
        }


        // process file
        const finalData = await processBibliography(fileName, userId, firstName, middleName, lastName);


        //  Handle errors returned from processBibliography
        if (finalData.error) {
            await db.ref(`users/${userId}/data/${fileName}`).remove(); // Delete from Firebase Realtime Database

            const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);
            await fileRef.delete(); // Delete from Firebase Storage
            return res.status(400).json({ error: finalData.error }); 
        }

        // Check if papers array is empty
        if (!finalData.papers || finalData.papers.length === 0) {
            await db.ref(`users/${userId}/data/${fileName}`).remove(); // Delete from Firebase Realtime Database

            const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);
            await fileRef.delete(); // Delete from Firebase Storage

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