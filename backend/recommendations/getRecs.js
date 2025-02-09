import fetch from "node-fetch"; // Ensure node-fetch is installed for Node.js

// Function to call the Semantic Scholar Recommendations API
export async function fetchRecommendedPapers(limit = 5, positivePaperIds = [], negativePaperIds = []) {
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
