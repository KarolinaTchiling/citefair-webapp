import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from '../components/Loader.jsx';
import Typewriter from '../components/Typewriter.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(() => {
        return location.state?.userData || JSON.parse(sessionStorage.getItem("userData")) || null;
    });
   
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, steError] = useState(null);

    useEffect(() => {

        if (!userData) {
            console.error("No result data, redirecting...");
            navigate("/");
            return;
        }

        // Store `userData` in sessionStorage for persistence
        sessionStorage.setItem("userData", JSON.stringify(userData));

        const { fileName, userId } = userData;

        const fetchData = async () => {
            // Step 1: Check if data exists in Firebase
            try {
                const storedResponse = await fetch(`${API_BASE_URL}/stats/getProcessedBib?fileName=${fileName}&userId=${userId}`);

                if (storedResponse.ok){
                    const storedData = await storedResponse.json();
                    if (storedData) {
                        console.log("Using stored data:", storedData);
                        setData(storedData);
                        setLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.warn("No stored data found, processing new request...");
            }

            // Step 2: If no stored data, call processBib API
            try {
                const response = await fetch(`${API_BASE_URL}/stats/processBib`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(userData),
                });
        
                if (!response.ok) {
                    let errorMessage = "An unknown error occurred";
            
                    // Handle specific error codes
                    if (response.status === 400) {
                        errorMessage = "Bad Request: Missing or invalid data.";
                    } else if (response.status === 401) {
                        errorMessage = "Unsuccessful parsing: No papers found in the bibliography. Try another file.";
                    } else if (response.status === 500) {
                        errorMessage = "Server Error: Something went wrong on the backend.";
                    } else {
                        errorMessage = `Unexpected Error: ${response.statusText} (Code ${response.status})`;
                    }
            
                    throw new Error(errorMessage);
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
    }, [userData, navigate]);

    // Convert gender distribution data to a format that Recharts can use
    const genderData = data?.genders
        ? Object.entries(data.genders).map(([gender, percentage]) => ({
                name: gender,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];

    // Convert gender distribution data to a format that Recharts can use
    const catData = data?.categories
        ? Object.entries(data.categories).map(([categories, percentage]) => ({
                name: categories,
                value: parseFloat(percentage), // Convert percentage string to a number
            }))
        : [];

    const authorMap = {
        W: { label: "Women Authors", color: "#FF6384" }, // Pink
        M: { label: "Men Authors", color: "#29C2E0" },   // Blue
        X: { label: "Unknown", color: "#E0E0E0" }, // Grey
    
        MM: { label: "First and last authors are men", color: "#29C2E0" },  // Blue
        MW: { label: "Man first author and woman last author", color: "#FFCE56" },  // Yellow
        WM: { label: "Woman first author and man last author", color: "#AD85FF" },  // Purple
        WW: { label: "First and last authors are women", color: "#FF6384" },  // Pink
    };
    
    

    return (
        <div className="flex flex-col">
            <Navbar />

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
                        <>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-6xl text-white font-semibold text-center pt-28">Uh-Oh!</p>
                            <p className="text-4xl text-white font-semibold text-center pt-6 pb-12">{error}</p>
                            <button
                                className="px-12 py-2 text-2xl md:text-3xl text-black bg-yellow font-[500] rounded-full hover:bg-yellow/70 hover:scale-110 transition duration-200"
                                onClick={() => window.history.back()}>
                                Go Back 
                            </button>
                        </div>
                        </>
                        
                    ) : (
                        
                        <>
                        <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />
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
                                            <ResponsiveContainer width="100%" height={330}>
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
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={authorMap[entry.name]?.color || "#000000"} // Use color from authorMap
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend
                                                        formatter={(value) => authorMap[value]?.label || value}
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
                                            <ResponsiveContainer width="100%" height={400}>
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
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={authorMap[entry.name]?.color || "#000000"} // Use color from authorMap
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend
                                                        formatter={(value) => authorMap[value]?.label || value}
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
            <Footer />
        </div>
       
    );
};

export default ResultsPage;
