import express from "express";
import { processBibliography } from "../services/StatsService.js";

const router = express.Router();


router.post("/processBib", async (req, res) => {
    try {
        const { fileName, userId } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await processBibliography(fileName, userId);
        res.json(finalData);
    } catch (error) {
        console.error("Error processing bibliography:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});




export default router;