import express from "express";
import { 
    getFileContent, 
    getTitles, 
    getPapers, 
    fetchAuthorGender, 
    calculatePercentages, 
    calculateCategories, 
    processBibliography 
} from "../services/StatsService.js";

const router = express.Router();

// 🔹 Step 1: Test fetching file content
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

// 🔹 Step 2: Test extracting titles from the file
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

// 🔹 Step 3: Test fetching paper metadata
router.post("/getPapers", async (req, res) => {
    try {
        const { titles } = req.body;
        if (!titles || !Array.isArray(titles)) return res.status(400).json({ error: "Valid titles array is required" });

        const papers = await getPapers(titles);
        res.json({ papers });
    } catch (error) {
        console.error("Error fetching papers:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// 🔹 Step 4: Test fetching author gender data
router.post("/fetchAuthorGender", async (req, res) => {
    try {
        const { papers } = req.body;
        if (!papers || !Array.isArray(papers)) return res.status(400).json({ error: "Valid papers array is required" });

        const papersWithGender = await fetchAuthorGender(papers);
        res.json({ papersWithGender });
    } catch (error) {
        console.error("Error fetching author gender:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// 🔹 Step 5: Test calculating gender statistics
router.post("/calculateStats", async (req, res) => {
    try {
        const { papersWithGender } = req.body;
        if (!papersWithGender || !Array.isArray(papersWithGender)) return res.status(400).json({ error: "Valid papersWithGender array is required" });

        const percentages = calculatePercentages(papersWithGender);
        const categories = calculateCategories(papersWithGender);

        res.json({ percentages, categories });
    } catch (error) {
        console.error("Error calculating statistics:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

// 🔹 Final Step: Run the full process end-to-end
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

// 🔹 Simple GET route to check if API is working
router.get("/test", (req, res) => {
    res.status(200).json({ response: "Testing API is working!" });
});

export default router;
