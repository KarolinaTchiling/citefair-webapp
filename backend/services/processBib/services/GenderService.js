import { chunkArray } from "../utils/chunk.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

/**
 * STEP 3
 * 
 * This service uses Gender-API to label author genders. Done in batches 50 names.
 * 
 */

export async function fetchAuthorGender(papers) {
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
                id: authorId.toString(), 
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

