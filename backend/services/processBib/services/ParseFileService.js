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
      // The file content has to be cleaned so that the parser wont break
      
      //1. convert all texts to unicode format
      let fileContentC = fileContent.normalize('NFC');

      //2. remove all BibTeX comments
      fileContentC = fileContentC.replace(/%.*$/gm, '');

      //3. replace all of the curly quotes with straight quotes
      fileContentC = fileContentC.replace(/[\u2018\u2019\u201C\u201D]/g, '"');

      //4. remove all of repeated and's in the authors section(sarah and and john)
      fileContentC = fileContentC.replace(/author\s*=\s*{([^}]*)}/gi, (_, authors) => {

        const authorsC = authors.replace(/\band\s+and\b/gi, 'and');//replace all of the repeated ands between the authors name (john and and and sarah -> john and sarah)

        return `author={${authorsC}}`; // return the authors name with single and bewtween the names
      }
      );

      //5. remove all of the commas inside any numbers
      fileContentC = fileContentC.replace(/(?<=\d),(?=\d)/g, "");

      //6. remove all of $ signs used for math expressions in the bib file
      fileContentC = fileContentC.replace(/\$(.*?)\$/g, "$1");

      //7. replace all of the characeters in the content that breaks the parser within all sections

      fileContentC = fileContentC.replace(/=\s*{([^}]*)}/g, (_, section) => {

        // for the captured sections replace all the charactes that breaks the parser
        const sectionC = section.replace(/@/g, " at ") //replace @ with at
                                .replace(/#/g, "") // remove #
                                .replace(/\$/g, "") // remove $
                                .replace(/\\&/g, "and") // replace & with and
                                .trim(); //
        return `={${sectionC}}`;
      });

      const bib = parseString(fileContentC);
      const entries = bib.entries;
  
      const titles = Object.keys(entries)
        .map((key) => {
          const title = entries[key].fields?.title?._unicode;
          return title ? title.replace(/[?:'"]/g, " ").replace(/\s+/g, " ").trim() : null; // removes remaining special characters that breaks the url request
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


