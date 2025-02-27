import { db } from "../config/firebaseConfig.js";
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

export const getRelatedWorks = async (fileName, userId) => {
    const titles = await getTitles(fileName, userId);
    const ss_ids = await getIds(titles);
    const related_papers = await fetchRecommendedPapers(5, ss_ids);
    const result = await fetchAuthorGender(related_papers);

    // Save results to Realtime Database
    try {
        await db.ref(`users/${userId}/data/${fileName}/related`).set(result);
    } catch (error) {
        console.error("Error saving related works:", error);
        throw error;
    }
    return result;
};

async function getTitles (fileName, userId)  {
    let data;
    try {
      // Use the Realtime Database API to get the data snapshot
      const dataRef = db.ref(`users/${userId}/data/${fileName}/processedBib`);
      const snapshot = await dataRef.once("value");
      data = snapshot.val();
      if (!data) {
        throw new Error("No data found at processedBib");
      }
    } catch (error) {
      console.error("Error retrieving field value:", error);
      throw error;
    }
  
    const titles = data.papers.map(paper => paper.title);
    // console.log(titles);
    return titles;
};

async function fetchPaperByTitle(title) {
    const apiUrl = `https://api.semanticscholar.org/graph/v1/paper/search/match?query=${encodeURIComponent(title)}`;
    const headers = {
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await fetch(apiUrl, { headers });
  
      if (response.status === 404) {
        console.log(`No match found for title: "${title}"`);
        return { title, error: "Title match not found" };
      }
  
      if (!response.ok) {
        console.error(`Error fetching data for title "${title}":`, response.statusText);
        return { title, error: response.statusText };
      }
  
      const data = await response.json();
      console.log(`Raw API response for "${title}":`, data);
  
      // Return the first result from the API
      const bestMatch = data.data[0];
      return {
        title, // Original query title
        paperId: bestMatch.paperId,
        matchedTitle: bestMatch.title,
        matchScore: bestMatch.matchScore,
      };
    } catch (error) {
      console.error(`Error processing title "${title}":`, error.message);
      return { title, error: error.message };
    }
  }

// Get all response data from semantic scholar - but return only paper ids
async function getIds(titles) {
    const results = [];
    for (const title of titles) {
        const result = await fetchPaperByTitle(title);
        if (result.paperId) {
        results.push(result.paperId); // Append only the paperId
        } else {
        // console.warn(`No paperId found for title: "${title}"`);
        }
    }
    return results;
}

// Function to call the Semantic Scholar Recommendations API
async function fetchRecommendedPapers(limit = 5, positivePaperIds = [], negativePaperIds = []) {
    const apiUrl = "https://api.semanticscholar.org/recommendations/v1/papers/";
    const params = new URLSearchParams({
      fields: "title,url,publicationDate,authors,citationCount",
      limit: limit.toString(),
    });
  
    try {
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          positivePaperIds: positivePaperIds,
          negativePaperIds: negativePaperIds,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
  
      const data = await response.json();
      // console.log("Raw API Response:", data);
  
      return data;
    } catch (error) {
      console.error("Error fetching recommended papers:", error.message);
      return [];
    }
  }

async function fetchAuthorGender(data) {
    const baseUrl = "https://gender-api.com/get";
    const apiKey = process.env.GENDER_API_KEY;
  
    if (!apiKey) {
      throw new Error("API key is missing. Make sure it is set in the .env file.");
    }
  
    const result = []; // To store the final transformed data
  
    for (const paper of data.recommendedPapers) {
      console.log(`Labelling Gender for paper: ${paper.paperId}`);
  
      const authorsGender = []; // To store genders for authors in the current paper
  
      for (const author of paper.authors) {
        // const firstName = author.name.split(" ")[0]; // Extract first name from full name
  
        try {
          const response = await fetch(
            `${baseUrl}?name=${encodeURIComponent(author.name)}&key=${apiKey}`
          );
          const genderData = await response.json();
  
          // Check gender and accuracy, and assign M, W, or X
          if (genderData.accuracy >= 70) {
            if (genderData.gender === "male") {
              authorsGender.push({ ...author, gender: "M" });
            } else if (genderData.gender === "female") {
              authorsGender.push({ ...author, gender: "W" });
            } else {
              authorsGender.push({ ...author, gender: "X" }); // Handle unexpected gender responses
            }
          } else {
            authorsGender.push({ ...author, gender: "X" });
          }
        } catch (error) {
          console.error(`Failed to fetch gender for ${author.name}:`, error);
          authorsGender.push({ ...author, gender: "X" }); // Default to "X" if an error occurs
        }
      }
  
      // Push the transformed paper object to the result array
      result.push({
        paperId: paper.paperId,
        title: paper.title,
        url: paper.url,
        citationCount: paper.citationCount,
        publicationDate: paper.publicationDate,
        authors: authorsGender,
      });
    }
    console.log(result);
    return result; // Return the transformed data structure
}




