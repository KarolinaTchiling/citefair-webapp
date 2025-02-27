import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from '../components/Loader.jsx';
import Typewriter from '../components/Typewriter.jsx';
import Sidebar from '../components/Sidebar.jsx';


const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { resultData } = location.state || {}; // Retrieve the data passed from RunButton

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, steError] = useState(null);

    useEffect(() => {

        if (!resultData) {
            console.error("No result data, redirecting...");
            navigate("/");
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

    // Convert gender distribution data to a format that Recharts can use
    const genderData = data?.genders
        ? Object.entries(data.genders).map(([gender, percentage]) => ({
                name: gender,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];

    // Define colors for each gender category
    const colors1 = ["#FF6384", "#29C2E0", "#E0E0E0"]; // W (Pink), M (Blue), X (Grey)

    const genderLabels = {
        W: "Women Authors",
        M: "Men Authors",
        X: "Unknown Gender",
    };

    // Convert gender distribution data to a format that Recharts can use
    const catData = data?.categories
        ? Object.entries(data.categories).map(([categories, percentage]) => ({
                name: categories,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];
    

    // Define colors for each gender category
    const colors2 = ["#29C2E0", "#FFCE56", "#AD85FF", "#FF6384", "#E0E0E0"]; // MM (Blue), MW (Yellow), MW (Purple), WW (Pink), X (Grey)

    const catLabels = {
        MM: "First and last authors are men",
        MW: "Man first author and woman last author",
        WM: "Woman first author and man last author",
        WW: "First and last authors are women",
        X: "Unknown Category",
    };


    return (
        <div className="flex flex-col">
            <Navbar />

            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />

            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center h-[calc(100vh-64px)]">

                {loading ? (
                    <>
                        <div className="h-[20vh] flex items-center justify-center">
                            <div className=" text-white flex flex-col text-center">
                                <div className="text-5xl font-semibold ">Hold Tight...</div>
                                <div className="text-lg pt-2">Your analysis is being generated!</div>
                            </div>
                        </div>

                        <div className="pt-10">
                            <Loader />
                        </div>
                        <Typewriter />
                
                    </>
                    
                    ) : error ? (
                        <p className="text-white text-lg bg-red-600 p-3 rounded-md">Error: {error}</p>
                    ) : (
                        <>
                        {/* Heading Section (20% of screen height) */}
                        <div className="h-[20vh] flex items-center justify-center">
                        <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
                            Your Citation Analysis Results
                        </h1>
                        </div>

                        {/* Summary Section */}
                        <div className="mt-1 p-1 bg-indigo w-[86%] text-white text-xl grid grid-cols-2 gap-10 mr-56">
                        <div className="text-right">
                            <p><strong>Total Papers:</strong> {data?.total_papers}</p>
                            <p><strong>Number of Self-Citations:</strong> {data?.number_of_self_citations}</p>
                            <p><strong>Unsuccessful article matches:</strong> {data?.title_not_found}</p>
                        </div>
                        <div className="text-left">
                            <p className="text-lg">
                            Articles which were unsuccessfully matched mean that sufficient author data was not found.
                            Thus, both self-cited articles and unmatched articles are excluded from the bias analysis.
                            </p>
                        </div>
                        </div>



                            {/* Pie Charts */}
                            <div className="flex flex-row mb-10 gap-20"> 
                                    <div className="mt-6 p-4 bg-indigo rounded-md">
                                        <h2 className="text-2xl text-white text-center font-semibold pb-2">Gender Distribution of all Authors</h2>
                                        {genderData.length > 0 ? (
                                            <ResponsiveContainer width={400} height={330}>
                                                <PieChart>
                                                    <Pie
                                                        data={genderData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ percent }) => ` ${(percent * 100).toFixed(1)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {genderData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={colors1[index % colors1.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend
                                                        formatter={(value) => genderLabels[value] || value} 
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p>No gender data available.</p>
                                        )}
                                    </div>

                                    <div className="mt-6 p-4 bg-indigo rounded-md">
                                        <h2 className="text-2xl text-white text-center font-semibold pb-2">Distribution of Gender Categories</h2>
                                        {catData.length > 0 ? (
                                            <ResponsiveContainer width={400} height={400}>
                                                <PieChart>
                                                    <Pie
                                                        data={catData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {catData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={colors2[index % colors2.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend
                                                        formatter={(value) => catLabels[value] || value} 
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <p>No cat data available.</p>
                                        )}
                                    </div>

                            </div>                    
                        </>

                    )}

            </div>
        </div>
       
    );
};

export default ResultsPage;
