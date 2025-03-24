import { db } from "../firebaseConfig.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { getTitles } from "./ParseFileService.js"
import { Cite } from '@citation-js/core'
import '@citation-js/plugin-doi'
import '@citation-js/plugin-csl'
import '@citation-js/plugin-bibtex';

dotenv.config();


/**
 * These service gets analyzes the gender statistics of a bibliography.
 * The service starts with a list of titles preprocessed with the ParseFileService.js
 * 
 * PIPELINE:
 * Get author data from Open Alex  -> labelling gender using Gender-API -> calculating gender stats 
 * 
 * It is used in: ../routes/StatsRoutes.js
 */

// MAIN function --------------------------------------------------------------------------------

// Fully Automated Bibliography Processing
export const processBibliography = async (fileName, userId, firstName, middleName, lastName) => {
    try {
        // Get Titles
        const titles = await getTitles(fileName, userId);
        
        if (!titles || titles.length === 0) {
            throw new Error("No titles extracted. Please check the file.");
        }

        // Get Papers Data
        const papersData = await getPapers(titles, firstName, middleName, lastName);
        if (!papersData || !papersData.results) {
            throw new Error("No papers found. Unable to process bibliography.");
        }

        const papers = papersData.results;
        const papersWithGender = await fetchAuthorGender(papers);

        // Calculate gender statistics
        const genderStats = calculatePercentages(papersWithGender);
        const categoryStats = calculateCategories(papersWithGender);

        // Prepare the final processed data
        const processedData = {
            papers: papersWithGender,
            genders: genderStats,
            categories: categoryStats,
            number_of_self_citations: papersData.number_of_self_citations,
            title_not_found: papersData.title_not_found,
            total_papers: papersData.total_papers,
            processedAt: new Date().toISOString(),
        };

        // **Save results to Firebase**
        await db.ref(`users/${userId}/data/${fileName}/processedBib`).set({
            ...processedData,
        });

        return processedData;

    } catch (error) {
        console.error("Error in processBibliography:", error.message);

        // Pass the error up the chain to the route handler
        return { error: error.message };
    }
};

// FUNCTIONS ------------------------------------------------------------------------------

// Fetch paper details from OpenAlex API
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


// Step 1: Process multiple titles by calling @fetchPapers
// this is used to get author data
// this also removes self-citations 
// this also gets BibTeX citation using citation.js
async function getPapers(titles, firstName, middleName, lastName) {
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

            // Get BibTeX from citation.js
            let bibtex = null;
            try {
                const cite = await Cite.async(doi);
                bibtex = cite.format('bibtex');
            } catch (err) {
                console.error(`Failed to generate BibTeX for ${doi}:`, err);
            }
            
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

// Helper function to split an array into chunks
function chunkArray(array, size) {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
        array.slice(index * size, index * size + size)
    );
};

//  Step 2: Fetch author gender from Gender-API
async function fetchAuthorGender(papers) {
    const baseUrl = "https://gender-api.com/v2/gender/by-full-name-multiple";
    const apiKey = process.env.GENDER_API_KEY;

    if (!apiKey) {
        throw new Error("API key is missing. Make sure it is set in the .env file.");
    }

    // Collect all authors from all papers
    const authorRequests = [];
    let authorId = 1;
    for (const paper of papers) {
        if (paper.error) continue; // Skip papers with errors

        for (const author of paper.authors) {
            authorRequests.push({
                id: authorId.toString(), // Keep original unique ID
                full_name: author.name.trim()
            });
            authorId++;
        }
    }

    if (authorRequests.length === 0) return papers;

    const BATCH_SIZE = 50;
    const batches = chunkArray(authorRequests, BATCH_SIZE);

    try {
        const genderMap = new Map(); // Store all responses across batches

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            console.log(`Processing batch ${i + 1}/${batches.length} (Size: ${batch.length})`);

            const response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(batch)
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    console.error(`Gender-API Error: ${errorJson.title} - ${errorJson.detail}`);
                } catch (e) {
                    console.error(`Gender-API Error: ${errorText}`);
                }
                throw new Error(`Error fetching gender data: ${response.statusText}`);
            }

            const genderResults = await response.json();
            console.log(`Received ${genderResults.length} results in batch ${i + 1}`);

            // Store results in a map for easy lookup
            for (const result of genderResults) {
                if (result?.input?.id) {
                    genderMap.set(result.input.id, result);
                }
            }
        }

        // Map gender results back to authors in papers
        for (const paper of papers) {
            if (paper.error) continue;

            for (const author of paper.authors) {
                const genderData = genderMap.get(authorRequests.find(a => a.full_name === author.name)?.id);

                if (!genderData) {
                    console.warn(`No gender data found for: ${author.name}`);
                    author.gender = "X";  // Assign "X" if missing
                    author.prob = 0;
                } else {
                    // console.log("Mapped Gender Data:", genderData);

                    let gender = "X";
                    if (genderData?.result_found) {
                        gender = genderData.gender === "male" ? "M" : genderData.gender === "female" ? "W" : "X";
                    }

                    author.gender = gender;
                    author.prob = genderData.probability ?? 0;  // Default to 0 if missing
                }
            }
        }
    } catch (error) {
        console.error("Failed to fetch batch gender data:", error);
    }

    return papers;
};


// Step 3: Calculate gender statistics
function calculatePercentages(data) {
    let total = 0, countW = 0, countM = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
        if (paper.selfCitation) continue; // skip self citation
        for (const author of paper.authors) {
            total++;
            if (author.gender === "W") countW++;
            else if (author.gender === "M") countM++;
            else countX++;
        }
    }

    return {
        W: `${((countW / total) * 100).toFixed(2)}%`,
        M: `${((countM / total) * 100).toFixed(2)}%`,
        X: `${((countX / total) * 100).toFixed(2)}%`
    };
};
function calculateCategories(data) {
    let total = 0, countMM = 0, countMW = 0, countWM = 0, countWW = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
        if (paper.selfCitation) continue; // skip self citation
        const first = paper.authors[0]?.gender;
        const last = paper.authors[paper.authors.length - 1]?.gender;

        if (first === "M" && last === "M") countMM++;
        else if (first === "M" && last === "W") countMW++;
        else if (first === "W" && last === "M") countWM++;
        else if (first === "W" && last === "W") countWW++;
        else countX++;

        total++;
    }

    return { MM: `${((countMM / total) * 100).toFixed(2)}%`, MW: `${((countMW / total) * 100).toFixed(2)}%`, WM: `${((countWM / total) * 100).toFixed(2)}%`, WW: `${((countWW / total) * 100).toFixed(2)}%`, X: `${((countX / total) * 100).toFixed(2)}%` };
};

