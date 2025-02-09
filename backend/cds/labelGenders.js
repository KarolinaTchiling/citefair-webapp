import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function fetchAuthorGender(papers) {
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

    return result; // Return the transformed data structure
}


