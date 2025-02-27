import express from "express";
import { generateStatements} from "../services/StatementService.js";
// import { db } from "../config/firebaseConfig.js";

const router = express.Router();

router.post("/generateCds", async (req, res) => {
    try {
        const { fileName, userId } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await generateStatements(fileName, userId );
        res.json(finalData);
    } catch (error) {
        console.error("Error generating CDSs:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


export default router;