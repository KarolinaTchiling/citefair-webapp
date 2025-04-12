import { processBibliography } from "../services/ProcessBibService.js";
import { db, bucket } from "../../../utils/firebaseConfig.js";

// Processes the bibliography using  processBibliography function from the services
export const processBibController = async (req, res) => {
  try {
    const { fileName, firstName, middleName, lastName } = req.body;
    const userId = req.user.uid; 

    if (!fileName || !userId) {
      return res.status(400).json({ error: "fileName and userId are required" });
    }

    const fileRef = bucket.file(`users/${userId}/uploads/${fileName}`);
    try {
      await fileRef.getMetadata();
    } catch (error) {
      if (error.code === 404) {
        return res.status(404).json({ error: "File does not exist. Please upload the file first." });
      }
      throw error;
    }

    const finalData = await processBibliography(fileName, userId, firstName, middleName, lastName);

    if (finalData.error) {
      await db.ref(`users/${userId}/data/${fileName}`).remove();
      await fileRef.delete();
      return res.status(400).json({ error: finalData.error });
    }

    if (!finalData.papers || finalData.papers.length === 0) {
      await db.ref(`users/${userId}/data/${fileName}`).remove();
      await fileRef.delete();
      return res.status(401).json({ error: "Unsuccessful parsing: No papers found in the bibliography." });
    }

    res.json(finalData);
  } catch (error) {
    console.error("Error processing bibliography:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// Retrieves the process bib data from the firebase db
export const getProcessedBibController = async (req, res) => {
  try {
    const { fileName } = req.query;
    const userId = req.user.uid; 

    if (!fileName ) {
      return res.status(400).json({ error: "fileName and userId are required" });
    }

    const snapshot = await db.ref(`users/${userId}/data/${fileName}/processedBib`).once("value");
    const storedData = snapshot.val();

    if (!storedData) {
      return res.status(404).json(null);
    }

    res.json(storedData);
  } catch (error) {
    console.error("Error fetching stored data:", error);
    res.status(500).json({ error: "Failed to retrieve stored data" });
  }
};
