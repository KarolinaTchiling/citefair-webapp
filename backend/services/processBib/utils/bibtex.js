import { Cite } from '@citation-js/core';
import '@citation-js/plugin-doi';
import '@citation-js/plugin-csl';
import '@citation-js/plugin-bibtex';
import fetch from "node-fetch";

/**
 * Gets BibTeX from DOI or falls back to Semantic Scholar search
 * @param {string} title - The paper title
 * @param {string|null} doi - The paper DOI (can be null)
 * @returns {Promise<string|null>} - BibTeX string or null
 */
export async function getBibtex(title, doi) {
    let bibtex = null;
  
    if (!doi) {
      // Fallback: Try Semantic Scholar
      try {
        const ssRes = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search/match?query=${encodeURIComponent(title)}&fields=citationStyles`
        );
        const ssData = await ssRes.json();
  
        const citation = ssData?.data?.[0]?.citationStyles?.bibtex;
        if (citation) {
          bibtex = citation;
        } else {
          console.warn(`No BibTeX found in Semantic Scholar for: ${title}`);
        }
      } catch (error) {
        console.error("Semantic Scholar fallback failed:", error);
      }
    } else {
      // Use Citation.js to fetch BibTeX from DOI
      try {
        const cite = await Cite.async(doi);
        bibtex = cite.format("bibtex");
      } catch (err) {
        console.error(`Failed to generate BibTeX for DOI ${doi}:`, err);
      }
    }
  
    return bibtex;
};

