import { getFileContent } from './getFileContent.js';
import { cleanData } from './parseBibContent.js';
import { fetchAuthorGender } from './getGenders.js';
import { calculateCategories, calculatePercentages } from './genderStats.js';
import { catStatement, totalStatement } from './getStatement.js';

export async function generate(userId) {
    try {
        // Step 1: Fetch file content using the user ID --------------
        const fileContent = await getFileContent(userId);
        // console.log("Fetched file content:", fileContent);

        // Step 2: Clean and parse the data --------------------------
        const cleanedData = await cleanData(fileContent);
        // console.log("Cleaned data:", cleanedData);

        //Step 3: Get Gender Assignments ----------------------------
        const genderData = await fetchAuthorGender(cleanedData)
        // console.log("Gender data:", genderData);

        // Step 4: Calculate Gender Stats ---------------------------
        const totalGender = calculatePercentages(genderData);
        // console.log("Total gender percentages:", totalGender);

        const catGender = calculateCategories(genderData); 
        // console.log("Gender category percentages:", catGender);

        // Step 5: get citation diversity statement ----------------
        const totalState = totalStatement(totalGender);
        // console.log(totalState);

        const catState = catStatement(catGender);
        // console.log(catState);

        return {
            category_data: catGender,
            general_data: totalGender,
            category_statement: catState,
            general_statement: totalState,
        };

    } catch (error) {
      console.error("Error in generate function:", error);
      throw error; 
    }
  }