// These service includes the entire workflow to get gender statistics from the uploaded bib
//      downloading file from db -> extracting titles -> getting author data from Open Alex 
//          -> labelling gender using Gender-API -> calculating gender stats 
// All of these are run from the processBibliography function which takes a fileName and userId


import { bucket, db } from "../firebaseConfig.js";
import pkg from "bibtex";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const { parseBibFile } = pkg;

// 🔹 Step 1: Get file content from Firebase
export const getFileContent = async (fileName, userId) => {
    const file = bucket.file(`users/${userId}/uploads/${fileName}`);

    const [exists] = await file.exists();
    if (!exists) throw new Error(`File '${fileName}' not found for user '${userId}'`);

    const [fileContent] = await file.download();
    return fileContent.toString("utf-8");
};

// 🔹 Step 2: Extract and process titles from the .bib file
export const getTitles = async (fileName, userId) => {
    const fileContent = await getFileContent(fileName, userId);
    return extractTitlesFromBib(fileContent);
};

// 🔹 Step 3: Parse .bib content and extract titles
const extractTitlesFromBib = (fileContent) => {
    const bibFile = parseBibFile(fileContent);
    const entries = bibFile["entries$"];

    if (!entries || typeof entries !== "object") {
        throw new Error("Invalid .bib file structure.");
    }

    return Object.keys(entries)
        .map((key) => {
            const entry = entries[key];
            const titleData = entry.fields?.title?.data;
            return Array.isArray(titleData) ? titleData.join("").trim() : null;
        })
        .filter(Boolean); // Removes null/undefined values
};

// 🔹 Step 4: Fetch paper details from OpenAlex API
const fetchPaper = async (title) => {
    const apiURL = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(title)}&per_page=1&select=id,display_name,relevance_score,authorships&mailto=k.tchiling@gmail.com`;
    
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

// Utility function to add a delay (to avoid rate limits)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 🔹 Step 5: Process multiple titles by fetching related papers
// this is used to get author data
// this also removes self-citations 
export const getPapers = async (titles, firstName, middleName, lastName) => {
    const results = [];
    const cleanedTitles = titles.map(title => title.replace(/,/g, "")); // Remove commas
    let number_of_self_citations = 0;
    let title_not_found = 0;
    let total_papers = 0;


    let fullName;
    if (!middleName){
        fullName = firstName + " " + lastName; 
    } else {
        fullName = firstName + " " + middleName + " " + lastName;
    }

    console.log(fullName);

    for (const [index, title] of cleanedTitles.entries()) {
        if (index > 0) await delay(100); // 100ms delay to respect rate limits

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
            const relevance_score = result.results[0]?.relevance_score;

            let selfCitation = false;


            for (const author of authors){
                if (author.name == fullName){
                    selfCitation = true;
                    number_of_self_citations += 1;
                    break;
                }
            }

            if (!selfCitation) {
                results.push({
                    title,
                    matchedTitle,
                    authors,
                    relevance_score
                });
            } 
        }
    }

    return { results, number_of_self_citations, title_not_found, total_papers };
};

// 🔹 Step 6: Fetch author gender from Gender-API
export const fetchAuthorGender = async (papers) => {
    const baseUrl = "https://gender-api.com/get";
    const apiKey = process.env.GENDER_API_KEY;

    if (!apiKey) {
        throw new Error("API key is missing. Make sure it is set in the .env file.");
    }

    const result = []; // To store the final transformed data

    for (const paper of papers) {
        // Skip papers with errors
        if (paper.error) {
            console.warn(`Skipping paper: ${paper.title} (Error: ${paper.error})`);
            result.push(paper);
            continue;
        }

        console.log(`Processing paper: ${paper.title}`);

        const authorsGender = []; // To store genders for authors in the current paper

        for (const author of paper.authors) {
            try {
                // Fetch gender for the author
                const response = await fetch(
                    `${baseUrl}?name=${encodeURIComponent(author.name)}&key=${apiKey}`
                );
                const genderData = await response.json();

                // Assign gender based on accuracy and response
                let gender = "X"; // Default to "X" for uncertain cases
                if (genderData.accuracy >= 70) {
                    gender = genderData.gender === "male" ? "M" : genderData.gender === "female" ? "W" : "X";
                }

                authorsGender.push({
                    name: author.name,
                    gender: gender,
                });
            } catch (error) {
                console.error(`Failed to fetch gender for ${author.name}:`, error);
                authorsGender.push({
                    name: author.name,
                    gender: "X", // Default to "X" if an error occurs
                });
            }
        }

        // Push the transformed paper object to the result array
        result.push({
            title: paper.title,
            matchedTitle: paper.matchedTitle,
            authors: authorsGender,
            relevance_score: paper.relevance_score,
        });
    }

    return result;
};

// 🔹 Step 7: Calculate gender statistics
export const calculatePercentages = (data) => {
    let total = 0, countW = 0, countM = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
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

export const calculateCategories = (data) => {
    let total = 0, countMM = 0, countMW = 0, countWM = 0, countWW = 0, countX = 0;

    for (const paper of data) {
        if (paper.error) continue;
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

// 🔹 Final Step: Fully Automated Bibliography Processing
export const processBibliography = async (fileName, userId, firstName, middleName, lastName) => {
    const titles = await getTitles(fileName, userId);
    const papersData = await getPapers(titles, firstName, middleName, lastName);
    const papers = papersData.results
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
};
