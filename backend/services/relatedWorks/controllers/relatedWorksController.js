import { runRelatedWorks } from "../services/RelatedWorksService.js";
import { db } from "../../../utils/firebaseConfig.js";


// Generates related works from the relatedWorksService 
export const relatedWorksController = async (req, res) => {
    try {
        const userId = req.user.uid; 
        const { fileName } = req.body;
        if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

        const finalData = await runRelatedWorks(fileName, userId );
        res.json(finalData);
    } catch (error) {
        console.error("Error generating related works:", error.message);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}

// Retrieves the related works from the realtime Firebase db
export const getRelatedWorksController = async (req, res) => {
    try {
        const userId = req.user.uid; 
        const { fileName } = req.query;

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

}
