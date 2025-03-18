import { db } from "../firebaseConfig.js";
import dotenv from "dotenv";
import fetch from 'node-fetch';

dotenv.config();

// Main function which runs: 
// 1. getting dois from the realtime DB
// 2. calls Sematic Scholar Recommendation API
// 3. labels related papers with Gender-API
export const getRelatedWorks = async (fileName, userId) => {
    const dois = await getDois(fileName, userId);
    const related_papers = await fetchRecommendedPapers(50, dois);
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

// FUNCTIONS -------------------------------------------------------------------------------------

// 1. gets DOIs from realtime DB
async function getDois(fileName, userId) {
  console.log("Fetching DOIs for file:", fileName);

  const ref = db.ref(`users/${userId}/data/${fileName}/processedBib/papers`);
  const snapshot = await ref.once("value");

  if (snapshot.exists()) {
    const papers = snapshot.val();
    const dois = [];

    // Iterate over all papers and collect DOIs if they exist
    Object.values(papers).forEach((paper) => {
      if (paper.doi) {
        const formattedDOI = `doi:${paper.doi.replace(/^https:\/\/doi\.org\//, "")}`;
        dois.push(formattedDOI);
      }
    });

    return dois;
  }

  console.log("No DOIs found.");
  return [];
}


// 2. Call the Semantic Scholar Recommendations API 
async function fetchRecommendedPapers(limit = 5, positivePaperIds = [], negativePaperIds = []) {
    console.log("Calling Semantic Scholar with the following positive papers....")
    console.log(positivePaperIds);
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

// 3.  label the related papers with genders in batches of 50
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

