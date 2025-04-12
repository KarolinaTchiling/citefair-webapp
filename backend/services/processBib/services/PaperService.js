import { getBibtex} from "../utils/bibtex.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

/**
 * STEP 2
 * 
 * This service uses titles to fetch papers from OPEN ALEX, removes self-citations & generates BibTeX citations 
 * OPEN ALEX returns authors and doi 
 * 
 * BibTeX citations are generated using citation.js with Semantic Scholar acting as a fallback 
 * 
 */

export async function getPapers(titles, firstName, middleName, lastName) {
    const results = [];
    const cleanedTitles = titles.map(title => title.replace(/,/g, "")); // Remove commas
    let number_of_self_citations = 0;
    let title_not_found = 0;
    let total_papers = 0;

    const fullName = middleName
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;

    console.log(fullName);

    for (const title of cleanedTitles) {

        const result = await fetchPaper(title);
        total_papers += 1;
        
        if (result.meta?.count === 0) {
            results.push({ title, error: "Title not found" });
            title_not_found += 1;
        } else {
            const matchedTitle = result.results[0]?.display_name;
            const authors = (result.results[0]?.authorships || []).map(auth => ({
                name: auth.author?.display_name
            }));

            const doi = result.results[0]?.doi;
            const bibtex = await getBibtex(title, doi);

            let selfCitation = authors.some(
                author => author.name?.toLowerCase().trim() === fullName.toLowerCase().trim()
              );
        
            if (selfCitation) number_of_self_citations += 1;

            results.push({
                selfCitation,
                doi,
                title,
                matchedTitle,
                authors,
                bibtex,
            });
        }
    }

    return { results, number_of_self_citations, title_not_found, total_papers };
};



async function fetchPaper(title) {
    const apiURL = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(title)}&per_page=1&select=id,doi,display_name,authorships&mailto=citefairly@gmail.com&api_key=${process.env.OPEN_ALEX_API_KEY}`;
    
    try {
        console.log(`Fetching data for title: "${title}"`);
        console.log("---------------------------------------------------------------------------------------------------");

        const response = await fetch(apiURL, { headers: { "Content-Type": "application/json" } });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch paper for title: "${title}"`, error);
        return { title, error: "Failed to fetch paper data" };
    }
};
