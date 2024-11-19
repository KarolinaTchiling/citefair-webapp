import path from "path";
import { fileURLToPath } from "url";
import { fetchFileFromFirebase } from "./fetchFile.js";
import { parseBibContent } from "./parseBib.js";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const userId = "DZBQzZpKuIhxjwKjsy5nlSitSk33"; // Replace with actual user ID
    const fileName = "ease-references.bib"; // File name in Firebase Storage

    // Fetch the .bib file from Firebase
    const bibContent = await fetchFileFromFirebase(userId, fileName);

    // Parse and process the .bib file content
    parseBibContent(bibContent);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();