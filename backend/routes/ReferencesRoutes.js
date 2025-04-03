import express from "express";
import { db } from "../firebaseConfig.js";
import fs from "fs";
import path from "path";
import os from "os";

const router = express.Router();

// Fetches references from the realtime Firebase db
router.get("/get-refs", async (req, res) => {
    try {
        const { fileName, userId } = req.query;

        if (!fileName || !userId) {
            return res.status(400).json({ error: "fileName and userId are required"});

        }

        const snapshot = await db.ref(`users/${userId}/data/${fileName}/references`).once("value");
        const storedData = snapshot.val();

        if (!storedData) {
            return res.status(404).json(null);
        }

        res.json(storedData);
    } catch (error) {
        console.error("Error fetching stored data:", error);
        res.status(500).json({error: "Failed to retrieve stored data"})
    }

});


router.post("/add-ref", async (req, res) => {
  try {
    const { uid, fileName, paperId } = req.body;

    if (!uid || !fileName || !paperId) {
      return res.status(400).json({ error: "uid, fileName, and paperId are required" });
    }

    // Get related papers
    const relatedPath = `users/${uid}/data/${fileName}/related`;
    const relatedSnapshot = await db.ref(relatedPath).once("value");

    if (!relatedSnapshot.exists()) {
      return res.status(404).json({ error: "Related papers not found." });
    }

    const relatedPapers = relatedSnapshot.val();
    const papersArray = Object.values(relatedPapers);
    const matchedPaper = papersArray.find(paper => paper.paperId === paperId);

    if (!matchedPaper) {
      return res.status(404).json({ error: "Paper with given paperId not found." });
    }

    // Get current reference list
    const refsPath = `users/${uid}/data/${fileName}/references`;
    const refsSnapshot = await db.ref(refsPath).once("value");

    let currentRefs = [];

    if (refsSnapshot.exists()) {
      currentRefs = refsSnapshot.val();

      // Normalize to array
      if (!Array.isArray(currentRefs)) {
        currentRefs = Object.values(currentRefs);
      }
    }

    // Prevent duplicates based on paperId
    const alreadyExists = currentRefs.some(ref => ref.paperId === paperId);
    if (alreadyExists) {
      return res.status(409).json({ error: "Paper already exists in reference list." });
    }

    // Add full article object
    currentRefs.unshift(matchedPaper);

    // Save updated reference list
    await db.ref(refsPath).set(currentRefs);

    return res.status(200).json({ message: "Paper added to reference list.", paper: matchedPaper });

  } catch (error) {
    console.error("Error adding paper to reference list:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-ref", async (req, res) => {
  try {
    const { uid, fileName, title } = req.body;

    if (!uid || !fileName || !title) {
      return res.status(400).json({ error: "uid, fileName, and title are required" });
    }

    const refsPath = `users/${uid}/data/${fileName}/references`;
    const refsSnapshot = await db.ref(refsPath).once("value");

    if (!refsSnapshot.exists()) {
      return res.status(404).json({ error: "No reference list found." });
    }

    let currentRefs = refsSnapshot.val();

    if (!Array.isArray(currentRefs)) {
      currentRefs = Object.values(currentRefs); // Normalize if it's a keyed object
    }

    // Filter out the paper with matching title
    const updatedRefs = currentRefs.filter(ref => ref.title !== title);

    // If nothing was removed
    if (updatedRefs.length === currentRefs.length) {
      return res.status(404).json({ error: "No matching paper found to delete." });
    }

    // Save updated reference list
    await db.ref(refsPath).set(updatedRefs);

    return res.status(200).json({ message: `Paper with title "${title}" removed from reference list.` });

  } catch (error) {
    console.error("Error deleting paper from reference list:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/download-ref", async (req, res) => {
  try {
    const { uid, fileName } = req.body;

    if (!uid || !fileName) {
      console.warn("Missing uid or fileName");
      return res.status(400).json({ error: "uid and fileName are required" });
    }

    // Step 1: Fetch references from Firebase
    const refsPath = `users/${uid}/data/${fileName}/references`;
    const refsSnapshot = await db.ref(refsPath).once("value");

    if (!refsSnapshot.exists()) {
      console.warn("No reference list found at path:", refsPath);
      return res.status(404).json({ error: "No reference list found." });
    }

    let currentRefs = refsSnapshot.val();
    if (!Array.isArray(currentRefs)) {
      currentRefs = Object.values(currentRefs);
    }

    // Step 2: Extract and concatenate BibTeX strings
    const bibtexEntries = currentRefs
      .map(ref => ref.bibtex)
      .filter(Boolean)
      .join("\n\n");

    // Step 3: Generate versioned filename
    const versionedFileName = getVersionedFileName(fileName);

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, versionedFileName);

    // Step 4: Write to temp file
    fs.writeFileSync(tempFilePath, bibtexEntries);
;
    // Step 5: Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${versionedFileName}"`);
    res.setHeader("Content-Type", "application/x-bibtex");

    // Step 6: Stream file to client
    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.pipe(res);

    // Step 7: Cleanup temp file
    fileStream.on("end", () => {
      fs.unlink(tempFilePath, err => {
        if (err) {
          console.error("Failed to delete temp file:", err);
        } else {
          console.log("Temp file deleted");
        }
      });
    });

  } catch (error) {
    console.error(" Error generating BibTeX download:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


function getVersionedFileName(originalName) {
  let name = originalName.replace(/\.(bib|txt)$/i, "");
  name = name.replace(/_(bib|txt)$/i, "");
  name = name.replace(/_(bib|txt)(?=_v\d+|$)/i, "");

  const versionRegex = /_v(\d+)$/i;
  const match = name.match(versionRegex);

  if (match) {
    const currentVersion = parseInt(match[1], 10);
    name = name.replace(versionRegex, `_v${currentVersion + 1}`);
  } else {
    name = `${name}_v1`;
  }
  const finalName = `${name}.bib`;
  return finalName;
}


export default router;