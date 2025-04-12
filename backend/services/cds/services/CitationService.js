import { db } from "../../../utils/firebaseConfig.js";

/**
 * Add the cds references to the users references
 */
export const addCdsReferences = async (userId, fileName) => {
    const cdsPath = `cdsRefs`;
    const refsPath = `users/${userId}/data/${fileName}/references`;
  
  
    const cdsSnapshot = await db.ref(cdsPath).once("value");
    if (!cdsSnapshot.exists()) throw new Error("No CDS references found");
  
    const cdsPapers = Object.values(cdsSnapshot.val());
  
    const refsSnapshot = await db.ref(refsPath).once("value");
    const currentRefs = refsSnapshot.exists() ? Object.values(refsSnapshot.val()) : [];
  
    const existingDois = new Set(currentRefs.map(ref => ref.doi?.toLowerCase()));
  
    // Filter out CDS papers that already exist in the reference list
    const newPapers = cdsPapers.filter(paper => {
      const doi = paper.doi?.toLowerCase();
      return doi && !existingDois.has(doi);
    });
  
    // Prepend new CDS refs to the existing list
    const updatedRefs = [...newPapers, ...currentRefs];
  
    // Save updated list to Firebase
    await db.ref(refsPath).set(updatedRefs);
  
    return {
      message: `${newPapers.length} new CDS references added to reference list.`,
      added: newPapers,
    };
  };
