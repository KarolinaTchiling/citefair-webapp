import { getFileContent } from "./getFileContent.js"; 
import pkg from "bibtex";
const { parseBibFile } = pkg;


// Public function: Clean and process titles
export async function getTitles(filepath) {
  try {
    const fileContent = await getFileContent(filepath); 
    const parsedData = parseBibContent(fileContent);
    
    return parsedData;
  } catch (error) {
    console.error("Error in cleanTitles:", error);
    throw error;
  }
}

// Private function: Parse .bib content into JSON
function parseBibContent(fileContent) {
    try {
      const bibFile = parseBibFile(fileContent); // Parses the entire file
      const entries = bibFile["entries$"]; // Access entries in the parsed file

      const titles = [];
  
      const results = Object.keys(entries).map((key) => {
        const entry = entries[key];
        const titleData = entry.fields.title.data;
        const title = titleData.join('').trim();
        titles.push(title);
      });
  
      return titles; // Return parsed results
    } catch (error) {
      console.error("Error parsing .bib content:", error);
      throw error;
    }
  }



