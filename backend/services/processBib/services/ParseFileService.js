import { bucket } from "../../../utils/firebaseConfig.js";
import dotenv from "dotenv";
import { parseString } from 'bibliography'
dotenv.config();

/**
 * STEP 1 
 * 
 * These service parses uploaded bibliographies to extract titles.
 * Currently supports .bib and .txt
 * 
 * This service is a precursor to the StatService.
 * 
 */

// Main  -------------------------------------------------------------------------------
export async function getTitles(fileName, userId) {
    const fileContent = await getFileContent(fileName, userId);

    if (fileName.endsWith("_txt")) {
        return extractTitlesFromTxt(fileContent);
    } else if (fileName.endsWith("_bib")) {
        const result = extractTitlesFromBib(fileContent);
        
        if (result.error) {
            throw new Error(result.error); // Convert the error object to a thrown error
        }

        return result.titles; // Only return the titles array
    } else {
        throw new Error("Unsupported file type. Expected filename to end with '_txt' or '_bib'.");
    }
}

// FUNCTIONs --------------------------------------------------------------------------------------

// Step 1: get file content 
export async function getFileContent(fileName, userId) {
    const file = bucket.file(`users/${userId}/uploads/${fileName}`);

    const [exists] = await file.exists();
    if (!exists) throw new Error(`File '${fileName}' not found for user '${userId}'`);

    const [fileContent] = await file.download();
    return fileContent.toString("utf-8");
};


// Step 2: Extract titles from .bib or .txt 
function extractTitlesFromBib(fileContent) {
    try {
      const bib = parseString(fileContent);
      const entries = bib.entries;
  
      const titles = Object.keys(entries)
        .map((key) => {
          const title = entries[key].fields?.title?._unicode;
          return title ? title.trim() : null;
        })
        .filter(Boolean); // Remove null/undefined
  
    //   // Print each title inside the function to verify
    //   console.log(" Extracted Titles:");
    //   titles.forEach((title, index) => {
    //     console.log(`  ${index + 1}. ${title}`);
    //   });
  
      return { titles };
    } catch (error) {
      console.error("Error processing bibliography:", error.message);
      return { error: error.message };
    }
  }

function extractTitlesFromTxt(fileContent) {
    // Use regex to find all substrings inside double quotes
    const matches = fileContent.match(/"([^"]+)"/g);

    // Remove quotes from each match
    const extractedTitles = matches 
    ? matches.map(title => title.replace(/"/g, '').replace(/,$/, '')) 
    : [];

    return extractedTitles;
};


