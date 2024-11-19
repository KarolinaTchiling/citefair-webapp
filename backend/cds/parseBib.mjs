import pkg from 'bibtex';
const {parseBibFile, normalizeFieldValue} = pkg;
import fs from 'fs/promises'; // Use promises for modern async/await

async function parseBibFromFile(filePath) {
  try {
    // Read the .bib file contents
    const bibContent = await fs.readFile(filePath, 'utf-8');

    // Parse the BibTeX content
    const bibFile = parseBibFile(bibContent);

    // Access all entries using entries$
    const entries = bibFile['entries$']; // Object containing all entries
    Object.keys(entries).forEach((key) => {
      const entry = entries[key];
      console.log(`Entry Key: ${key}`);

      // Access fields such as title, author, etc.
      const titleField = entry.getField('title');
      console.log('Title:', normalizeFieldValue(titleField));

      // Access authors
      const authorField = entry.getField('author');
      if (authorField && authorField.authors$) {
        console.log('Authors:');
        authorField.authors$.forEach((author) => {
          console.log(
            (author.firstNames.concat(author.vons, author.lastNames, author.jrs)).join(' ')
          );
        });
      }
      console.log('\n');
    });
  } catch (error) {
    console.error('Error reading or parsing .bib file:', error);
  }
}

// Specify the path to your .bib file
const filePath = './ease-references.bib'; // Update this to your file path
parseBibFromFile(filePath);
