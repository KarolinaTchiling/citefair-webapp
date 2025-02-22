import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resultData } = location.state || {}; // Retrieve the data passed from RunButton

    console.log(resultData);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, steError] = useState(null);

    useEffect(() => {

        if (!resultData) {
            console.error("No result data, redirecting...");
            Navigate("/");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/stats/processBib", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(resultData),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
        
                const result = await response.json(); 
                setData(result); //store data in state
        
            } catch (error) {
                console.error("Error:", error);
                steError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resultData, navigate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;



    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Results</h1>

            {/* Paper Information */}
            {data?.papers?.length > 0 ? (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <h2 className="text-xl font-semibold">Processed Papers</h2>
                    {data.papers.map((paper, index) => (
                        <div key={index} className="mt-3 p-3 border rounded-md bg-white shadow-sm">
                            <h3 className="text-lg font-medium">{paper.title}</h3>
                            <p><strong>Matched Title:</strong> {paper.matchedTitle}</p>
                            <p><strong>Relevance Score:</strong> {paper.relevance_score.toFixed(2)}</p>
                            <h4 className="mt-2 font-semibold">Authors:</h4>
                            <ul className="list-disc pl-5">
                                {paper.authors.map((author, i) => (
                                    <li key={i}>{author.name} ({author.gender})</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No papers found.</p>
            )}

            {/* Gender Distribution */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-xl font-semibold">Gender Distribution</h2>
                <ul className="list-disc pl-5">
                    {data?.genders &&
                        Object.entries(data.genders).map(([gender, percentage], index) => (
                            <li key={index}><strong>{gender}:</strong> {percentage}</li>
                        ))}
                </ul>
            </div>

            {/* Citation Categories */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-xl font-semibold">Citation Categories</h2>
                <ul className="list-disc pl-5">
                    {data?.categories &&
                        Object.entries(data.categories).map(([category, percentage], index) => (
                            <li key={index}><strong>{category}:</strong> {percentage}</li>
                        ))}
                </ul>
            </div>

            {/* Other Stats */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-xl font-semibold">Other Statistics</h2>
                <p><strong>Number of Self-Citations:</strong> {data?.number_of_self_citations}</p>
                <p><strong>Titles Not Found:</strong> {data?.title_not_found}</p>
            </div>
        </div>
    );
};

export default ResultsPage;
