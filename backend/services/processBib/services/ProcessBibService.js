import { db } from "../../../utils/firebaseConfig.js";
import { getTitles } from "./ParseFileService.js";
import { getPapers } from "./PaperService.js";
import { fetchAuthorGender } from "./GenderService.js";
import { calculatePercentages, calculateCategories } from "./StatsCalculationService.js";

/**
 * MAIN function
 * 
 * This is the main function of the entire bib processing pipeline
 * 
 * PIPELINE:
 *  1. Extract titles from the uploaded file        (ParseBibService.js)
 *      2. Get author data from Open Alex               (PaperService.js)
 *          3.  labelling gender using Gender-API           (GenderService.js) 
 *              4. calculating gender stats                     (StatsCalculationService.js)
 *                    --> Saving to firebase DB                     (ProcessBibService.js)
 */

export const processBibliography = async (fileName, userId, firstName, middleName, lastName) => {
    try {
        // STEP 1: Get Titles
        const titles = await getTitles(fileName, userId);
        if (!titles || titles.length === 0) {
            throw new Error("No titles extracted. Please check the file.");
        }

        // STEP 2: Get Papers Data
        const papersData = await getPapers(titles, firstName, middleName, lastName);
        if (!papersData || !papersData.results) {
            throw new Error("No papers found. Unable to process bibliography.");
        }
        const papers = papersData.results;

        // STEP 3: Label author's with gender 
        const papersWithGender = await fetchAuthorGender(papers);


        // Step 4: Calculate gender statistics
        const genderStats = calculatePercentages(papersWithGender);
        const categoryStats = calculateCategories(papersWithGender);

        // Prepare the final processed data
        const processedData = {
            papers: papersWithGender,
            genders: genderStats,
            categories: categoryStats,
            number_of_self_citations: papersData.number_of_self_citations,
            title_not_found: papersData.title_not_found,
            total_papers: papersData.total_papers,
            processedAt: new Date().toISOString(),
        };


        // Save papers to references in firebase
        await db.ref(`users/${userId}/data/${fileName}/references`).set(papersWithGender);

        // Save results to Firebase
        await db.ref(`users/${userId}/data/${fileName}/processedBib`).set({
            ...processedData,
        });

        return processedData;

    } catch (error) {
        console.error("Error in processBibliography:", error.message);
        // Pass the error up the chain to the route handler
        return { error: error.message };
    }
};