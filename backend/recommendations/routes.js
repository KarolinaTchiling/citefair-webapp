import express from "express";
import { admin } from "../firebaseAdmin.js"; 
import { getFileContent } from "./getFileContent.js"; 
import { getTitles } from "./getTitles.js"; 
import { getIds } from "./getSSIds.js"; 
import {fetchRecommendedPapers} from "./getRecs.js";
import {fetchAuthorGender} from "./labelGenders.js";

// const bodyParser = require("body-parser");

const router = express.Router();


router.post("/get-file", async (req, res) => {
  try {
    // Authenticate the user using the token
    await authenticateToken(req);

    // Extract filepath from the request body
    const { filepath } = req.body;
    if (!filepath) {
      throw new Error("Filepath is required");
    }

    const response = await getFileContent(filepath);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error in /get-file:", error);
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
});

router.post("/get-titles", async (req, res) => {
  try {
    // Authenticate the user using the token
    // await authenticateToken(req);

    // Extract filepath from the request body
    const { filepath } = req.body;
    if (!filepath) {
      throw new Error("Filepath is required");
    }

    const titles = await getTitles(filepath);
    res.status(200).json({ titles });
  } catch (error) {
    console.error("Error in /get-titles:", error);
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
});

router.post("/get-ssids", async (req, res) => {
  try {
    // Authenticate the user using the token
    // await authenticateToken(req);

    // Extract titles from the request body
    const { titles } = req.body;
    if (!Array.isArray(titles) || titles.length === 0) {
      throw new Error("A list of titles is required");
    }

    const paperIds = await getIds(titles);
    // Respond with the paper IDs
    res.status(200).json({ paperIds });
  } catch (error) {
    console.error("Error in /get-ssids:", error);
    res.status(400).json({ error: error.message || "Bad Request" });
  }
});

router.post("/get-raw-recommendations", async (req, res) => {
  try {
    const { paperIds } = req.body;

    if (!Array.isArray(paperIds) || paperIds.length === 0) {
      return res.status(400).json({ error: "paperIds must be a non-empty array." });
    }

    const limit = 5; // You can customize this or accept it from the request body
    const recommendedPapers = await fetchRecommendedPapers(limit, paperIds, [""]);

    res.status(200).json({ recommendedPapers });
  } catch (error) {
    console.error("Error in /get-recommendations route:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});


router.post("/get-recommendations", async (req, res) => {
  try {
    const { recommendedPapers } = req.body;

    // Validate the input
    if (
      !recommendedPapers ||
      !Array.isArray(recommendedPapers.recommendedPapers) ||
      recommendedPapers.recommendedPapers.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input: recommendedPapers must be provided." });
    }

    // Call the fetchAuthorGender function
    const enrichedData = await fetchAuthorGender(req.body);

    // Respond with the enriched results
    res.status(200).json({ enrichedData });
  } catch (error) {
    console.error("Error in /get-recommendations route:", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});





const authenticateToken = async (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error("Authorization token is missing or invalid");
  }

  const token = authHeader.split(' ')[1]; // Extract the token part

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; 
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};


router.get("/test", async (req, res) => {
    try {
      const response = "hi"
      res.status(200).json({ response });
    } catch (error) {
      console.error("Error in /get-test:", error);
      res.status(401).json({ error: error.message || "Unauthorized" });
    }
  });

export default router;