import express from "express";
import { storage } from "../firebaseAdmin.js"; // Import the initialized storage
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Firebase Admin SDK
import { parseBibContent } from "../cds_generator/parseBib.js"; // Your existing parsing logic
import { getFileContent } from "../cds_generator/getFileContent.js"; 
import { extractNames } from "../cds_generator/extractNames.js"; 

const router = express.Router();

router.post("/generate", async (req, res) => {
    const { userId, fileName } = req.body;
  
    if (!userId || !fileName) {
      return res.status(400).json({ error: "User ID and file name are required" });
    }
  
    try {
      // Step 1: Get the file from the cloud
      const fileContent = await getFileContent(userId);
  
      // Step 2: Parse the file
      const parsedData = parseBibContent(fileContent);
        // console.log(parsedData);
  
      // Step 3: Extract names
    //   const names = extractNames(parsedData);
        console.log(JSON.stringify(parsedData, null, 2));

      const report = parsedData;

  
    //   // Step 4: Fix poor formatting
    //   const cleanedNames = cleanNames(names);
  
    //   // Step 5: Call Gender API
    //   const genders = await getGenderClassifications(cleanedNames);
  
    //   // Step 6: Calculate percentages
    //   const percentages = calculateGenderPercentage(genders);
  
    //   // Step 7: Generate text template
    //   const report = generateReport(percentages);
  
      // Return to the frontend
      res.status(200).json({ report });
    } catch (error) {
      console.error("Error in /generate:", error);
      res.status(500).json({ error: "Failed to analyze references" });
    }
  });
  
  export default router;
