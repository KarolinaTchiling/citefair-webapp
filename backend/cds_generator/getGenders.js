// Step 3 in the citation diversity statement generator
// Assign gender to each author

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
  
    for (const reference of data) {
      console.log(`Processing reference: ${reference.reference}`);
  
      const authorsGender = []; // To store genders for authors in the current reference
  
      for (const author of reference.authors) {
        const firstName = author[0]; // Assuming the last name is at index 1
  
        try {
          const response = await fetch(
            `${baseUrl}?name=${encodeURIComponent(firstName)}&key=${apiKey}`
          );
          const genderData = await response.json();
  
          // Check gender and accuracy, and assign M, W, or X
          if (genderData.accuracy >= 70) {
            if (genderData.gender === "male") {
              authorsGender.push("M");
            } else if (genderData.gender === "female") {
              authorsGender.push("W");
            } else {
              authorsGender.push("X"); // Handle unexpected gender responses
            }
          } else {
            authorsGender.push("X");
          }
        } catch (error) {
          console.error(`Failed to fetch gender for ${firstName}:`, error);
          authorsGender.push("X"); // Default to "X" if an error occurs
        }
      }
  
      // Push the transformed reference object to the result array
      result.push({
        reference: reference.reference,
        authors: authorsGender,
      });
    }
    console.log(result)
    return result; // Return the transformed data structure
  }