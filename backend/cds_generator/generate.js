import { getFileContent } from './getFileContent.js';
import { cleanData } from './parseBibContent.js';
import { fetchAuthorGender } from './getGenders.js';

export async function generate(userId) {
    try {
        // Step 1: Fetch file content using the user ID
        const fileContent = await getFileContent(userId);
        // console.log("Fetched file content:", fileContent);

        // Step 2: Clean and parse the data
        const cleanedData = await cleanData(fileContent); // Assuming cleanNames is asynchronous
        // console.log("Cleaned data:", cleanedData);

        //Step 3: Get Gender Assignments
        const genderData = await fetchAuthorGender(cleanedData)
        console.log("Gender data:", genderData);

        

    //   // Step 3: Further processing (if needed)
    //   const finalResult = cleanedData.map((entry) => {
    //     return {
    //       reference: entry.reference,
    //       authors: entry.authors.map(([firstName, lastName]) => `${firstName} ${lastName}`).join(", "),
    //     };
    //   });

    //   console.log("Final result:", finalResult);

        // Step 4: Return the processed result
    //   return finalResult;
    } catch (error) {
      console.error("Error in generate function:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }