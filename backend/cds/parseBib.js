import pkg from 'bibtex';

const { parseBibFile, normalizeFieldValue } = pkg;

export function parseBibContent(bibContent) {
  try {
    const bibFile = parseBibFile(bibContent);

    // Process entries
    const entries = bibFile['entries$']; // Object containing all entries
    Object.keys(entries).forEach((key) => {
      const entry = entries[key];
      console.log(`Entry Key: ${key}`);

      // Normalize and print the title
      const titleField = entry.getField('title');
      if (titleField) {
        console.log('Title:', normalizeFieldValue(titleField));
      }

      // Extract and print authors
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
    throw error;
  }
}
