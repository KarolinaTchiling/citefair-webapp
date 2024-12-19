import fetch from 'node-fetch'; // Ensure you have `node-fetch` installed or use a native fetch implementation.

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
  export async function getIds(titles) {
    const results = [];
    for (const title of titles) {
      const result = await fetchPaperByTitle(title);
      if (result.paperId) {
        results.push(result.paperId); // Append only the paperId
      } else {
        console.warn(`No paperId found for title: "${title}"`);
      }
    }
    return results;
  }

  // Get all response data from semantic scholar - paperID, title, matchScore
  async function fetchPapersForTitles(titles) {
    const results = [];
    for (const title of titles) {
    //   console.log(`Searching for title: "${title}"`);
      const result = await fetchPaperByTitle(title);
      results.push(result); // Append the enriched result
    }
    return results;
  }
  
//   // Example usage
//   (async () => {
//     const titles = [
//         "Leading countries in global science increasingly receive more citations than other countries doing similar research",
//         "Scientific citations favor positive results: a systematic review and meta-analysis",
//         "Citations: Indicators of quality? The impact fallacy",
//         "Global patterns in the publishing of academic knowledge: Global North, global South",
//         "Intersectional inequalities in science",
//         "Citation frequency: A biased measure of research impact significantly influenced by the geographical origin of research articles",
//         "A global bibliometric analysis of the scientific literature on entomotourism: exploring trends, patterns and research gaps",
//         "A bibliometric analysis of geographic disparities in the authorship of leading medical journals",
//         "Quantifying gender imbalance in East Asian academia: Research career and citation practice",
//         "Non-White scientists appear on fewer editorial boards, spend more time under review, and receive fewer citations",
//         "CausalCite: A Causal Formulation of Paper Citations",
//         "Quantifying gendered citation imbalance in computer science conferences",
//         "Biases in gendered citation practices: an exploratory study and some reflections on the Matthew and Matilda effects",
//         "The impact of conference ranking systems in computer science: A comparative regression analysis",
//         "Overcoming citation bias is necessary for true inclusivity in Plant Science",
//         "The gender citation gap: Approaches, explanations, and implications",
//         "Gender-based citation differences in speech--language pathology",
//         "Untangling the network effects of productivity and prominence among scientists",
//         "The Role of Gender in Citation Practices of Learning Analytics Research",
//         "Historical comparison of gender inequality in scientific careers across countries and disciplines",
//         "Gender (im) balance in citation practices in cognitive neuroscience",
//         "Homophily and missing links in citation networks",
//         "Bibliometrics: Global gender disparities in science",
//         "Racial and ethnic imbalance in neuroscience reference lists and intersections with gender",
//         "Citation inequity and gendered citation practices in contemporary physics",
//         "The extent and drivers of gender imbalance in neuroscience reference lists",
//         "Citation diversity statement in BMES journals",
//         "The Gender Citation Gap in Human Geography: Indications from Germany, Austria, and Switzerland",
//         "Citation bias, diversity, and ethics",
//         "Gender homophily in citations",
//         "Gender disparity in citations in high-impact journal articles",
//         "Gendered citation patterns among the scientific elite",
//         "Fairsna: Algorithmic fairness in social network analysis",
//         "Gender trends in computer science authorship"
//     ];
  
//     const results = await getIds(titles);
  
//     console.log("All Results:");
//     console.log(JSON.stringify(results, null, 2));
//   })();
  
