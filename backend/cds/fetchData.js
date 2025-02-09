import fetch from 'node-fetch';

async function fetchPaper(title) {
    const apiURL = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(title)}&per_page=1&select=id,display_name,relevance_score,authorships&mailto=k.tchiling@gmail.com`;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        console.log(title);
        console.log("---------------------------------------------------------------------------------------------------------------------")
        
        const response = await fetch(apiURL, { headers });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch paper:', error);
        throw error;
    }
}

// Utility function to add a delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function getPapers(titles) {
    const results = [];
    titles = titles.map(title => title.replace(/,/g, ''));
    
    for (const [index, title] of titles.entries()) {
        // Ensure we respect the rate limit (10 requests per second = 100ms delay between requests)
        if (index > 0) {
            await delay(100); // Add a 100ms delay between requests
        }

        const result = await fetchPaper(title);

        if (result.meta.count === 0) {
            // Handle case where title is not found
            results.push({
                title,
                error: "Title not found"
            });
        } else {
            // console.log(result.results[0]?.authorships);
            const matchedTitle = result.results[0]?.display_name;
            const authorship = result.results[0]?.authorships || [];
            const authors = authorship.map(item => ({
                name: item.author?.display_name
            }));
            const relevance_score = result.results[0]?.relevance_score;

            // Add the paper details to results
            results.push({
                title,
                matchedTitle,
                authors,
                relevance_score
            });
        }
    }

    return results; // Return as JSON with a top-level key
}
