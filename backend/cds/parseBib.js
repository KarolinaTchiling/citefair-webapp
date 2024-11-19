import pkg from 'bibtex';

const { parseBibFile, normalizeFieldValue } = pkg;

export function parseBibContent(bibContent) {
  try {
    const bibFile = parseBibFile(bibContent); // Assuming this parses the .bib content
    const entries = bibFile["entries$"]; // Access entries in the parsed file

    const results = Object.keys(entries).map((key) => {
      const entry = entries[key];
      return {
        key,
        title: entry.getField("title") || "No Title",
        authors: entry.getField("author") || "No Authors",
      };
    });

    return results; // Explicitly return the parsed results
  } catch (error) {
    console.error("Error parsing .bib content:", error);
    throw error;
  }
}
