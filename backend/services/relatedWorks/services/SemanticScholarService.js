import fetch from 'node-fetch';

/**
 * STEP 2
 * 
 * These service calls the Semantic Scholar Recommendations API, and returns the recommended articles with their metadata
 * 
 */

export async function fetchRecommendedPapers(limit = 5, positivePaperIds = [], negativePaperIds = []) {
    console.log("Calling Semantic Scholar with the following positive papers....")
    console.log(positivePaperIds);
    const apiUrl = "https://api.semanticscholar.org/recommendations/v1/papers/";
    const params = new URLSearchParams({
      fields: "title,url,authors,citationStyles",
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
  
      return data;
    } catch (error) {
      console.error("Error fetching recommended papers:", error.message);
      return [];
    }
  }