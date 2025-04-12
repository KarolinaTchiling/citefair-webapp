import {
    getReferences,
    addReference,
    deleteReference,
    downloadReferences,
  } from "../services/referenceService.js";
  
  export const getReferencesController = async (req, res) => {
    try {
      const { fileName } = req.query;
      const userId = req.user.uid; 

      if (!fileName || !userId) return res.status(400).json({ error: "fileName and userId are required" });

      const data = await getReferences(fileName, userId);
      res.json(data);
    } catch (error) {
      console.error("Error fetching references:", error);
      res.status(500).json({ error: "Failed to retrieve stored data" });
    }
  };
  
  export const addReferenceController = async (req, res) => {
    try {
      const { fileName, paperId } = req.body;
      const userId = req.user.uid; 

      if (!userId || !fileName || !paperId) return res.status(400).json({ error: "userId, fileName, and paperId are required" });
      const result = await addReference(userId, fileName, paperId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding paper to reference list:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const deleteReferenceController = async (req, res) => {
    try {
      const { fileName, title } = req.body;
      const userId = req.user.uid; 

      if (!userId || !fileName || !title) return res.status(400).json({ error: "userId, fileName, and title are required" });
      const result = await deleteReference(userId, fileName, title);
      
      res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting paper from reference list:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export const downloadReferencesController = async (req, res) => {
    try {
      const { fileName } = req.body;
      const userId = req.user.uid; 
      if (!userId || !fileName) return res.status(400).json({ error: "userId and fileName are required" });
      await downloadReferences(userId, fileName, res);
    } catch (error) {
      console.error("Error generating BibTeX download:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };