import React from "react";
import { useUser } from "../UserContext"; // Use the user context

function ParseFileButton() {
  const { userId } = useUser(); // Get the userId from context

  const handleParseFile = async () => {
    if (!userId) {
      console.error("User ID is required to parse the file.");
      return;
    }

    const fileName = "ease-references.bib"; // Example file name

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
      console.log("Parsed Result:", data.parsedResult);
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  return <button onClick={handleParseFile}>Parse File</button>;
}

export default ParseFileButton;


