import { bucket } from "../firebaseConfig.js";
import pkg from "bibtex";
import dotenv from "dotenv";

const { parseBibFile } = pkg;
dotenv.config();

/**
 * These service parses uploaded bibliographies to extract titles.
 * Currently supports .bib and .txt
 * 
 * This service is a precursor to the StatService.
 * 
 */

// Main function -------------------------------------------------------------------------------
export async function getTitles(fileName, userId) {
    const fileContent = await getFileContent(fileName, userId);

    if (fileName.endsWith("_txt")) {
        return extractTitlesFromTxt(fileContent);
    } else if (fileName.endsWith("_bib")) {
        return extractTitlesFromBib(fileContent);
    } else {
        throw new Error("Unsupported file type. Expected filename to end with '_txt' or '_bib'.");
    }
}

// FUNCTIONs --------------------------------------------------------------------------------------

// Step 1: get file content 
export async function getFileContent(fileName, userId) {
    const file = bucket.file(`users/${userId}/uploads/${fileName}`);

    const [exists] = await file.exists();
    if (!exists) throw new Error(`File '${fileName}' not found for user '${userId}'`);

    const [fileContent] = await file.download();
    return fileContent.toString("utf-8");
};


// Step 2: Extract titles from .bib or .txt 

function extractTitlesFromBib(fileContent) {
    const bibFile = parseBibFile(fileContent);
    const entries = bibFile["entries$"];

    if (!entries || typeof entries !== "object") {
        throw new Error("Invalid .bib file structure.");
    }

    return Object.keys(entries)
        .map((key) => {
            const entry = entries[key];
            const titleData = entry.fields?.title?.data;
            return Array.isArray(titleData) ? titleData.join("").trim() : null;
        })
        .filter(Boolean); // Removes null/undefined values
};

function extractTitlesFromTxt(fileContent) {
    // Use regex to find all substrings inside double quotes
    const matches = fileContent.match(/"([^"]+)"/g);

    // Remove quotes from each match
    const extractedTitles = matches 
    ? matches.map(title => title.replace(/"/g, '').replace(/,$/, '')) 
    : [];

    return extractedTitles;
};


