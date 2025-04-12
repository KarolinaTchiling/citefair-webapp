import { db } from "../../../utils/firebaseConfig.js";
import { getDois } from "./DoiService.js";
import { fetchRecommendedPapers } from "./SemanticScholarService.js";
import { fetchAuthorGender } from "./GenderService.js";

/**
 * MAIN function
 * 
 * This is the main function of the entire related works pipeline
 * 
 * PIPELINE:
 *  1. Extract doi from the processed bibliography                   (DoiService.js)
 *      2.  send those DOI to semantic Scholar Recommendation API       (SemanticScholarService.js)
 *          3.  label genders of authors of the returns papers              (GenderService.js)
 *              -> Save the results to the firebase DB                          (RelatedWorksService.js)
 */

export const runRelatedWorks = async (fileName, userId) => {
    const dois = await getDois(fileName, userId);
    const related_papers = await fetchRecommendedPapers(50, dois);
    const result = await fetchAuthorGender(related_papers);

    // Save results to Realtime Database
    try {
        await db.ref(`users/${userId}/data/${fileName}/related`).set(result);
    } catch (error) {
        console.error("Error saving related works:", error);
        throw error;
    }
    return result;
};






