import { db } from "../../../utils/firebaseConfig.js";

/**
 * STEP 1
 * 
 * These service returns a list of of DOIs from the processed bibliography stored in the Firebase DB
 * 
 */

export async function getDois(fileName, userId) {
    console.log("Fetching DOIs for file:", fileName);
  
    const ref = db.ref(`users/${userId}/data/${fileName}/processedBib/papers`);
    const snapshot = await ref.once("value");
  
    if (snapshot.exists()) {
      const papers = snapshot.val();
      const dois = [];
  
      // Iterate over all papers and collect DOIs if they exist
      Object.values(papers).forEach((paper) => {
        if (paper.doi) {
          const formattedDOI = `doi:${paper.doi.replace(/^https:\/\/doi\.org\//, "")}`;
          dois.push(formattedDOI);
        }
      });
  
      return dois;
    }
  
    console.log("No DOIs found.");
    return [];
  }
  