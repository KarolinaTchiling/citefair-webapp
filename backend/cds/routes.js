import express from "express";
import { admin } from "../firebaseAdmin.js"; 

import { getTitles } from "./getTitles.js"; 
import { getPapers } from "./fetchData.js"; 

import {fetchAuthorGender} from "./labelGenders.js";
import {calculatePercentages, calculateCategories, calculateMissing} from "./calculateStats.js";
import {catStatement, totalStatement, abbStatement, statementCitations} from "./getStatement.js";



const router = express.Router();


router.post("/get-titles", async (req, res) => {
    try {

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

router.post("/get-papers", async (req, res) => {
    try {

      // Extract filepath from the request body
      const { titles } = req.body;

      if (!Array.isArray(titles) || titles.length === 0) {
        return res.status(400).json({ error: "Titles must be a non-empty array." });
      }
  
      const papers = await getPapers(titles);
      res.status(200).json({ papers });
    } catch (error) {
      console.error("Error in /get-papers:", error);
      res.status(401).json({ error: error.message || "Unauthorized" });
    }
});

router.post("/get-gendered-papers", async (req, res) => {
    try {
        // Extract papers directly from the request body
        const { papers } = req.body;

        if (!Array.isArray(papers)) {
            return res.status(400).json({ error: "Invalid input format: 'papers' must be an array." });
        }

        // Process the papers using fetchAuthorGender
        const labelled_papers = await fetchAuthorGender(papers);

        // Respond with the transformed data
        res.status(200).json({ labelled_papers });
    } catch (error) {
        console.error("Error in cds/get-gendered-papers:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.post("/get-gender-stats", async (req, res) => {
    try {
        // Extract papers directly from the request body
        const { labelled_papers } = req.body;

        if (!Array.isArray(labelled_papers)) {
            return res.status(400).json({ error: "Invalid input format: 'labelled_papers' must be an array." });
        }

        const stats_a = calculatePercentages(labelled_papers);
        const stats_b = calculateCategories(labelled_papers);
        const stats_c = calculateMissing(labelled_papers);

        const stats =  {
            percentages: stats_a,
            categories: stats_b,
            missing: stats_c,
        };

        res.status(200).json({ stats });
    } catch (error) {
        console.error("Error in cds/get-gender-stats:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

router.post("/get-statements", async (req, res) => {
    try {
        // Extract papers directly from the request body
        const { stats } = req.body;

        if (!stats) {
            return res.status(400).json({ error: "Invalid input: 'stats' is required." });
        }

        const statement_a = catStatement(stats);
        const statement_b = totalStatement(stats);
        const statement_c = abbStatement();
        const refs = statementCitations();


        const cds =  {
            fullCategories: statement_a,
            fullGeneral: statement_b,
            abbreviated: statement_c,
            references: refs,
        };

        res.status(200).json({cds});
    } catch (error) {
        console.error("Error in cds/get-statements:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});




export default router;