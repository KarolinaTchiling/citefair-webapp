import { generateStatements} from "../services/StatementService.js";
import { addCdsReferences} from "../services/CitationService.js";

export const getCdsController = async (req, res) => {
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

export const addCdsReferencesController = async (req, res) => {
    try {
        const { fileName } = req.query;
        const userId = req.user.uid; 

        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await addCdsReferences(userId, fileName );
        res.json(finalData);
    } catch (error) {
        console.error("Error generating CDSs:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}
