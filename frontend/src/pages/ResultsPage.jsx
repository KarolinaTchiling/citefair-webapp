import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

    // Convert gender distribution data to a format that Recharts can use
    const genderData = data?.genders
        ? Object.entries(data.genders).map(([gender, percentage]) => ({
                name: gender,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];

    // Define colors for each gender category
    const COLORS1 = ["#FF6384", "#36A2EB", "#FFCE56"]; // W (Pink), M (Blue), X (Yellow)

    // Convert gender distribution data to a format that Recharts can use
    const catData = data?.categories
        ? Object.entries(data.categories).map(([categories, percentage]) => ({
                name: categories,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];

    // Define colors for each gender category
    const COLORS2 = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]; // W (Pink), M (Blue), X (Yellow)



    return (
        <div className="flex flex-col">
            <Navbar />

            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-64px)]">

                {/* Heading Section (20% of screen height) */}
                <div className="h-[20vh] flex items-center justify-center">
                    <div className="text-6xl md:text-5xl text-white font-semibold flex flex-col md:flex-row text-center md:text-left">
                        <div className="">Your Citation Analysis Results</div>
                    </div>
                </div>


                <div className="flex flex-row"> 


                <div className="mt-6 p-4 bg-indigo rounded-md">
                    <h2 className="text-xl text-white text-center font-semibold">Gender Distribution of all Authors</h2>
                    {genderData.length > 0 ? (
                        <ResponsiveContainer width={400} height={300}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS1[index % COLORS1.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No gender data available.</p>
                    )}
                </div>

                <div className="mt-6 p-4 bg-indigo rounded-md">
                    <h2 className="text-xl text-white text-center font-semibold">Gender Distribution of all Authors</h2>
                    {catData.length > 0 ? (
                        <ResponsiveContainer width={400} height={300}>
                            <PieChart>
                                <Pie
                                    data={catData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS2[index % COLORS2.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>No cat data available.</p>
                    )}
                </div>

                </div>



            {/* Citation Categories */}
            {/* <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-xl font-semibold">Citation Categories</h2>
                <ul className="list-disc pl-5">
                    {data?.categories &&
                        Object.entries(data.categories).map(([category, percentage], index) => (
                            <li key={index}><strong>{category}:</strong> {percentage}</li>
                        ))}
                </ul>
            </div> */}

            {/* Other Stats */}
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <h2 className="text-xl font-semibold">Other Statistics</h2>
                <p><strong>Number of Self-Citations:</strong> {data?.number_of_self_citations}</p>
                <p><strong>Titles Not Found:</strong> {data?.title_not_found}</p>
                <p><strong>Total Papers:</strong> {data?.total_papers}</p>
            </div>

            </div>
        </div>
    );
};

export default ResultsPage;
