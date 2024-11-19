import React, { useState } from "react";
import { useUser } from "../UserContext"; // Access userId from context

function ParseFileButton() {
  const { userId } = useUser();
  const [parsedResult, setParsedResult] = useState(null); // State to store parsed result
  const [error, setError] = useState(null); // State to store errors

  // Function to transform parsed result
  const transformParsedResult = (result) => {
    return result.map((entry) => {
      const title = entry.title.data.join("").trim(); // Join title parts
      const authors = entry.authors.authors$.map((author) => {
        const firstNames = author.firstNames.join(" ");
        const lastNames = author.lastNames.join(" ");
        return `${firstNames} ${lastNames}`.trim().replace(/\\['`^~]/g, ""); // Clean escape sequences
      });
      return {
        key: entry.key,
        title,
        authors,
      };
    });
  };

  const handleParseFile = async () => {
    if (!userId) {
      console.error("User ID is required to parse the file.");
      setError("User ID is required to parse the file.");
      return;
    }

    const fileName = "ease-references.bib"; // Replace with the actual file name

    try {
      const response = await fetch("http://localhost:5000/api/parse-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse the file");
      }

      const data = await response.json();
      const transformedResult = transformParsedResult(data.parsedResult); // Transform the result
      setParsedResult(transformedResult); // Save transformed result to state
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error parsing file:", err);
      setError(err.message); // Save the error to state
    }
  };

  return (
    <div>
      <button onClick={handleParseFile}>Parse File</button>

      {/* Show error if there is one */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render parsed results if available */}
      {parsedResult && (
        <div>
          <h3>Parsed Results:</h3>
          <ul>
            {parsedResult.map((entry, index) => (
              <li key={index}>
                {entry.authors.join(", ") || "No Authors"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ParseFileButton;
