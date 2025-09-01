import fetch from 'node-fetch';
import { chunkArray } from "../utils/chunk.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * STEP 3
 * 
 * These service labels the author genders with Gender-API in batches of 50 names at a time.
 * 
 */

export async function fetchAuthorGender(data) {
  const baseUrl = "https://gender-api.com/v2/gender/by-full-name-multiple";
  const apiKey = process.env.GENDER_API_KEY;

  if (!apiKey) {
      throw new Error("API key is missing. Make sure it is set in the .env file.");// Use author's full name as unique ID
  }

  // Collect all authors from recommended papers
  const authorRequests = [];
  for (const paper of data.recommendedPapers) {
      for (const author of paper.authors) {
        const trimmedName = author.name.trim();
        if(trimmedName.length <= 50){ //Author name length cannot be more than 50 characters
            authorRequests.push({
                id: trimmedName,
                full_name: trimmedName
            });
        }

      }
  }

  if (authorRequests.length === 0) return { recommendedPapers: data.recommendedPapers }; // No authors to process

  const BATCH_SIZE = 50; // API limit per request
  const batches = chunkArray(authorRequests, BATCH_SIZE);
  const genderMap = new Map(); // Store results for fast lookup

  try {
      for (const batch of batches) {
          console.log(`Processing batch of ${batch.length} author names...`);
          console.log("Batch content:", batch);
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
          bibtex: paper.citationStyles.bibtex,
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
