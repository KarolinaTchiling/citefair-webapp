import express from "express";
import { getRelatedWorks } from "../services/RelatedWorksService.js";
import { db } from "../firebaseConfig.js";

const router = express.Router();

router.post("/process-related-works", async (req, res) => {
    try {
        const { fileName, userId } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await getRelatedWorks(fileName, userId );
        res.json(finalData);
    } catch (error) {
        console.error("Error generating related works:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.get("/get-related-works", async (req, res) => {
    try {
        const { fileName, userId } = req.query;

        if (!fileName || !userId) {
            return res.status(400).json({ error: "fileName and userId are required"});

        }

        const snapshot = await db.ref(`users/${userId}/data/${fileName}/related`).once("value");
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