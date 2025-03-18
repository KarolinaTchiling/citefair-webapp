import { db } from "../firebaseConfig.js";
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

export const getRelatedWorks = async (fileName, userId) => {
    const titles = await getTitles(fileName, userId);
    const ss_ids = await getIds(titles);
    const related_papers = await fetchRecommendedPapers(50, ss_ids);
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

  // Helper function to split an array into chunks
const chunkArray = (array, size) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
  );
};

// label the related papers with genders in batches of 50
async function fetchAuthorGender(data) {
  const baseUrl = "https://gender-api.com/v2/gender/by-full-name-multiple";
  const apiKey = process.env.GENDER_API_KEY;

  if (!apiKey) {
      throw new Error("API key is missing. Make sure it is set in the .env file.");
  }

  // Collect all authors from recommended papers
  const authorRequests = [];
  for (const paper of data.recommendedPapers) {
      for (const author of paper.authors) {
          authorRequests.push({
              id: author.name, // Use author's full name as unique ID
              full_name: author.name.trim()
          });
      }
  }

  if (authorRequests.length === 0) return { recommendedPapers: data.recommendedPapers }; // No authors to process

  const BATCH_SIZE = 50; // API limit per request
  const batches = chunkArray(authorRequests, BATCH_SIZE);
  const genderMap = new Map(); // Store results for fast lookup

  try {
      for (const batch of batches) {
          console.log(`Processing batch of ${batch.length} author names...`);

          const response = await fetch(`${baseUrl}?key=${apiKey}`, {
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
          console.log(`Received ${genderResults.length} results`);

          // Store results in a map for easy lookup
          for (const result of genderResults) {
              if (result?.input?.full_name) {
                  genderMap.set(result.input.full_name, result);
              }
          }
      }
        return data.recommendedPapers.map(paper => ({
          paperId: paper.paperId,
          title: paper.title,
          url: paper.url,
          citationCount: paper.citationCount,
          publicationDate: paper.publicationDate,
          authors: paper.authors.map(author => {
              const genderData = genderMap.get(author.name.trim());
              return {
                  name: author.name,
                  gender: genderData?.result_found
                      ? (genderData.gender === "male" ? "M" : genderData.gender === "female" ? "W" : "X")
                      : "X",
                  prob: genderData?.probability ?? 0
              };
          })
      }));
  } catch (error) {
      console.error("Failed to fetch batch gender data:", error);
      return data.recommendedPapers; // Return original data if API fails
  }
}





