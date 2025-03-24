import express from "express";

import { 
    getFileContent, 
    getTitles,
} from "../services/ParseFileService.js";

const router = express.Router();

// Works for both .txt and .bib files
router.post("/getFileContent", async (req, res) => {
    try {
        const { fileName, userId } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const fileContent = await getFileContent(fileName, userId);
        res.json({ fileName, userId, fileContent });
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.post("/getTitles", async (req, res) => {
    try {
        const { fileName, userId } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const titles = await getTitles(fileName, userId);
        res.json({ fileName, userId, titles });
    } catch (error) {
        console.error("Error fetching titles:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


export default router;