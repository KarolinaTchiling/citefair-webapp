import { generateStatements} from "../services/StatementService.js";

export const getCds = async (req, res) => {
    try {
        const { fileName } = req.query;
        const userId = req.user.uid; 

        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await generateStatements(fileName, userId );
        res.json(finalData);
    } catch (error) {
        console.error("Error generating CDSs:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
