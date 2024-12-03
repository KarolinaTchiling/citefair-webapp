// Step 2 in the citation diversity statement generator
// This uses the bibtex package which parses the string into a refId and authors

import pkg from "bibtex";
const { parseBibFile } = pkg;

// Private function: Parse .bib content into JSON
function parseBibContent(fileContent) {
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

// Public function: Clean and process names
export async function cleanData(fileContent) {
  try {
    // Use the private `parseBibContent` function internally
    const parsedData = parseBibContent(fileContent);

    const cleanAuthorsByReference = parsedData.map((entry) => {
      if (entry.authors['authors$'] && Array.isArray(entry.authors['authors$'])) {
        const cleanedAuthors = entry.authors['authors$'].map((author) => {
          const firstName = decodeBibTeX(
            author.firstNames
              .filter((name) => typeof name === 'string' && name.length > 1)
              .join(' ')
          );
          const lastName = decodeBibTeX(
            author.lastNames
              .filter((name) => typeof name === 'string' && name.length > 1)
              .join(' ')
          );
          return [firstName, lastName];
        });

        return {
          reference: entry.key,
          authors: cleanedAuthors,
        };
      }

      const rawData = entry.authors.data;
      const joinedAuthors = Array.isArray(rawData) ? rawData.join(' ') : '';
      const splitAuthors = joinedAuthors.split(' and ');
      const cleanedAuthors = splitAuthors.map((author) =>
        author.replace(/^\s*,?\s*|\s*,?\s*$/g, '').trim()
      );

      return {
        reference: entry.key,
        authors: cleanedAuthors,
      };
    });

    // console.log(
    //   "Final cleaned authors by reference:",
    //   JSON.stringify(cleanAuthorsByReference, null, 2)
    // );

    return cleanAuthorsByReference; // Return the cleaned authors
  } catch (error) {
    console.error('Error in cleanNames:', error);
    throw error;
  }
}

// Decode BibTeX function
function decodeBibTeX(raw) {
  if (typeof raw !== 'string') {
    throw new TypeError(`Expected a string but got ${typeof raw}: ${JSON.stringify(raw)}`);
  }

  const replacements = {
    "\\`a": "à",
    "\\`e": "è",
    "\\`i": "ì",
    "\\`o": "ò",
    "\\`u": "ù",
    "\\'a": "á",
    "\\'e": "é",
    "\\'i": "í",
    "\\'o": "ó",
    "\\'u": "ú",
    '\\"a': "ä",
    '\\"o': "ö",
    '\\"u': "ü",
    '\\"A': "Ä",
    '\\"O': "Ö",
    '\\"U': "Ü",
    "\\~n": "ñ",
    "\\~N": "Ñ",
    "\\^a": "â",
    "\\^e": "ê",
    "\\^i": "î",
    "\\^o": "ô",
    "\\^u": "û",
    "\\'c": "ć",
    "\\'C": "Ć",
    "\\&": "&",
    "\\%": "%",
    "\\$": "$",
    "\\#": "#",
    "\\_": "_",
    "\\{": "{",
    "\\}": "}",
  };

  return raw
    .replace(/\\\\/g, "\\") 
    .replace(/\\[`'^"~][a-zA-Z]/g, (match) => {
      return replacements[match] || match; 
    });
}
