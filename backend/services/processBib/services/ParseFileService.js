import { bucket } from "../../../utils/firebaseConfig.js";
import { parseString } from 'bibliography'

/**
 * STEP 1 
 * 
 * This service parses uploaded bibliographies to extract titles.
 * Currently supports .bib and .txt
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
      fileContent = fileContent
        .normalize("NFC") 
        .replace(/%.*$/gm, '') // Remove LaTeX comments
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"') // // Replace smart quotes ‘ ’ with " "
        .replace(/author\s*=\s*{([^}]*)}/gi, (_match, authors) => {
          const cleanedAuthors = authors.replace(/\b(?:and\s+){1,}and\b/gi, 'and');
          return `author = {${cleanedAuthors}}`;
        }) // cleans multiple "and" in author section
        .replace(/(?<=\d),(?=\d)/g, '') // removes commas in numbers
        .replace(/\$(.*?)\$/g, '$1') // replaces inline math symbols
        .replace(/=\s*{([^}]*)}/g, (_match, value) => {
     const fixed = value
        .replace(/@/g, ' at ')     // replace @ with " at "
        .replace(/#/g, '')         // removes #
        .replace(/\$/g, '')        // Removes $
        .replace(/\\&/g, 'and')    // Replace \& with "and"
        .trim();
        return `= {${fixed}}`;
     })
    .replace(/([^\S\r\n]+)?}$/gm, ' }'); // fixes spacing on closing braces

      const bib = parseString(fileContent);
      console.log(bib);
      const entries = bib.entries;
  
      const titles = Object.keys(entries)
        .map((key) => {
          const title = entries[key].fields?.title?._unicode;
          return title ? title.trim() : null;
        })
        .filter(Boolean); // Remove null/undefined
    
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


