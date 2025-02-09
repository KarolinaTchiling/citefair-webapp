const data = {
    "recommendedPapers": {
        "recommendedPapers": [
            {
                "paperId": "9c8788a8f789d0053c3776ac29f3344e8a1e9261",
                "url": "https://www.semanticscholar.org/paper/9c8788a8f789d0053c3776ac29f3344e8a1e9261",
                "title": "Gender differences in representation, citations, and h-index: An empirical examination of the field of communication across the ten most productive countries",
                "citationCount": 0,
                "publicationDate": "2024-11-20",
                "authors": [
                    {
                        "authorId": "2582168",
                        "name": "M. Goyanes"
                    },
                    {
                        "authorId": "2331580879",
                        "name": "Esperanza Herrero"
                    },
                    {
                        "authorId": "2311496953",
                        "name": "Luis de-Marcos"
                    }
                ]
            },
            {
                "paperId": "469731be52a15e89349d6bb4d94e939733f94de8",
                "url": "https://www.semanticscholar.org/paper/469731be52a15e89349d6bb4d94e939733f94de8",
                "title": "Multidimensional Diversity and Research Impact in Political Science: What 50 Years of Bibliometric Data Tell Us",
                "citationCount": 0,
                "publicationDate": "2024-12-12",
                "authors": [
                    {
                        "authorId": "2117077867",
                        "name": "Yuner Zhu"
                    },
                    {
                        "authorId": "2412211",
                        "name": "Edmund W. Cheng"
                    }
                ]
            },
            {
                "paperId": "ec20dc86e1d26c7a60df0cf60f8dbbc2c77f5559",
                "url": "https://www.semanticscholar.org/paper/ec20dc86e1d26c7a60df0cf60f8dbbc2c77f5559",
                "title": "Identifying Trends in the Most Cited Nursing Articles: Research Topics, Author Gender Representation and Characteristics Correlated With Citation Counts.",
                "citationCount": 0,
                "publicationDate": "2024-10-23",
                "authors": [
                    {
                        "authorId": "2268317934",
                        "name": "Christopher Holmberg"
                    }
                ]
            },
            {
                "paperId": "a2e7ac1b92c3307f724d67b6fc6ed7724f839287",
                "url": "https://www.semanticscholar.org/paper/a2e7ac1b92c3307f724d67b6fc6ed7724f839287",
                "title": "Citation Sentiment Reflects Multiscale Sociocultural Norms",
                "citationCount": 0,
                "publicationDate": "2024-11-14",
                "authors": [
                    {
                        "authorId": "2237992455",
                        "name": "Xiaohuan Xia"
                    },
                    {
                        "authorId": "120478179",
                        "name": "Mathieu Ouellet"
                    },
                    {
                        "authorId": "1492181738",
                        "name": "Shubhankar P. Patankar"
                    },
                    {
                        "authorId": "2261430749",
                        "name": "Diana I. Tamir"
                    },
                    {
                        "authorId": "2060577809",
                        "name": "Danielle Bassett"
                    }
                ]
            },
            {
                "paperId": "295dcc81b1815dceb38db6a5cac221c1e57c1e6d",
                "url": "https://www.semanticscholar.org/paper/295dcc81b1815dceb38db6a5cac221c1e57c1e6d",
                "title": "Abstract 4136398: Gender Disparities Absent in Citation Metrics and Online Attention Across Thoracic Surgery Publications",
                "citationCount": 0,
                "publicationDate": "2024-11-12",
                "authors": [
                    {
                        "authorId": "2330619174",
                        "name": "Alyssa Sato"
                    },
                    {
                        "authorId": "2241356999",
                        "name": "Ronald P Karlsberg"
                    },
                    {
                        "authorId": "2330684595",
                        "name": "Carlos Quesada"
                    }
                ]
            }
        ]
    }
}
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function fetchAuthorGender(data) {
    const baseUrl = "https://gender-api.com/get";
    const apiKey = process.env.GENDER_API_KEY;
  
    if (!apiKey) {
      throw new Error("API key is missing. Make sure it is set in the .env file.");
    }
  
    const result = []; // To store the final transformed data
  
    for (const paper of data.recommendedPapers.recommendedPapers) {
      console.log(`Processing paper: ${paper.paperId}`);
  
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

// (async () => {
//     try {
//         const enrichedData = await fetchAuthorGender(data);
//         console.log("Enriched Data:", JSON.stringify(enrichedData, null, 2));
//     } catch (error) {
//         console.error("Error during execution:", error);
//     }
// })();
