import React, { useEffect, useState } from 'react';
import RecommendedPapers from "../components/RecommendedPapers";
import { useAuth } from "../AuthContext";

function RelatedPage() {
  const [data, setData] = useState(null); // State to hold the enriched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isAuthenticated } = useAuth();
  // const fileName = "ease-references.bib";
  // const filePath = `users/${user.uid}/uploads/${fileName}`;
  const token = user.accessToken; // Replace with the correct way to access your token
  
//   console.log(token);
//   console.log(user);
//   console.log(filePath);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const filePath = "users/NYj6VmrnlaXU8bgwPjb4z5nDZrz1/uploads/APSECrefs.bib";

        // Get the token (assume it's provided by your AuthContext or another service)
        const token = user.accessToken; // Replace with the correct way to access your toke
        if (!token) throw new Error("Authorization token is missing");

        // Step 2: Call /get-titles with the file content
        const titlesResponse = await fetch('http://localhost:5000/get-titles', {
            method: 'POST',
            headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token here
            },
            body: JSON.stringify({ filepath: filePath }),
        });
        if (!titlesResponse.ok) throw new Error("Failed to fetch titles");
        const titlesData = await titlesResponse.json();

        // Step 3: Call /get-ssids with titles
        const ssidsResponse = await fetch('http://localhost:5000/get-ssids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titles: titlesData.titles }),
        });
        if (!ssidsResponse.ok) throw new Error("Failed to fetch SSIDs");
        const ssidsData = await ssidsResponse.json();

        // Step 4: Call /get-raw-recommendations with paper IDs
        const rawRecommendationsResponse = await fetch('http://localhost:5000/get-raw-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paperIds: ssidsData.paperIds }),
        });
        if (!rawRecommendationsResponse.ok) throw new Error("Failed to fetch raw recommendations");
        const rawRecommendationsData = await rawRecommendationsResponse.json();

        console.log(rawRecommendationsData); // this right soo something happens after

        // Step 5: Call /get-recommendations with raw recommendations
        const recommendationsResponse = await fetch('http://localhost:5000/get-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rawRecommendationsData),
        });
        
        if (!recommendationsResponse.ok) throw new Error("Failed to fetch final recommendations");
        const recommendationsData = await recommendationsResponse.json();

        // Set the final enriched data
        setData(recommendationsData.enrichedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="pt-10 flex flex-row justify-center gap-7">
        <div className="flex">
          <RecommendedPapers data={{ enrichedData: data }} />
        </div>
      </div>
    </div>
  );
}

export default RelatedPage;
