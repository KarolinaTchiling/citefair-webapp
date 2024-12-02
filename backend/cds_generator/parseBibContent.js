// The second step in the citation diversity statement generator
// This uses the bibtex package which parses the string into a detailed json

import pkg from "bibtex";
const { parseBibFile } = pkg;

// Parse .bib content into JSON
export function parseBibContent(fileContent) {
  try {
    const bibFile = parseBibFile(fileContent); // Parses the entire file
    const entries = bibFile["entries$"]; // Access entries in the parsed file

    const results = Object.keys(entries).map((key) => {
      const entry = entries[key];
      return {
        key,
        title: entry.getField("title") || "No Title",
        authors: entry.getField("author") || "No Authors",
      };
    });

    return results; // Return parsed results
  } catch (error) {
    console.error("Error parsing .bib content:", error);
    throw error;
  }
}

// Extract only the keys and authors$ from the parsed data
export function simplify(parsedData) {
  return parsedData.map((entry) => {
    return {
      key: entry.key, // Extract the key as a string
      authors$: entry.authors?.authors$ || [], // Extract authors$ array or return an empty array if missing
    };
  });
}

// Unified function to parse and extract names
export async function parseAndExtractNames(fileContent) {
  try {
    const parsedData = parseBibContent(fileContent); // Step 1: Parse the file content
    const extractedNames = simplify(parsedData); // Step 2: Extract names
    return extractedNames; // Return final results
  } catch (error) {
    console.error("Error in parseAndExtractNames:", error);
    throw error;
  }
}
