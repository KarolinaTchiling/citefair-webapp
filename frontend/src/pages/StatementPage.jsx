import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatementPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cleanName, setCleanName] = useState(null);


    useEffect(() => {

        const sessionUserData = sessionStorage.getItem("userData");

        if (!sessionUserData) {
            console.error("No result data, redirecting...");
            navigate("/");
            return;
        }

        const userData = JSON.parse(sessionUserData);
        const fileName = userData.fileName;
        const userId = userData.userId;

        const cleanedName = fileName.replace(/_(bib|txt)$/i, "");
        setCleanName(cleanedName);

        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/cds/generateCds`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ fileName, userId }),
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
    }, [navigate]);


    return (
        <div>
            <Navbar />
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />

            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)]">


                {loading ? (
                    <div></div>
                ) : error ? (
                    <p className="text-white text-lg bg-red-600 p-3 rounded-md">Error: {error}</p>
                ) : (

                <>
                <div className="h-[13vh] flex items-center justify-center">
                    <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
                        Your Citation Diversity Statements - {cleanName}
                    </h1>
                </div>

                <div>
                    {data === null ? (
                        <p className="text-white text-lg">No statements found.</p>
                    ) : (
                        <div className="space-y-6 w-full max-w-4xl mb-20">
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                <h2 className="text-3xl font-semibold text-center py-2">Full Citation Diversity Statement - By Author Categories</h2>
                                <p>{data.catStatement}</p>
                            </div>

                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                            <h2 className="text-3xl font-semibold text-center py-2">Full Citation Diversity Statement - By Gender</h2>
                                <p>{data.genderStatement}</p>
                            </div>

                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                            <h2 className="text-3xl font-semibold text-center py-2">Abbreviated Citation Diversity Statement</h2>
                                <p>{data.abbStatement}</p>
                            </div>

                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                <h2 className="text-lg font-semibold text-center">Citations</h2>

                                <ol className="list-decimal list-inside">
                                    {Object.entries(data.citations).map(([key, citation]) => (
                                    <li key={key} className="text-gray-300 py-1">{citation}</li>
                                    ))}
                                </ol>
                            </div>

                        </div>
                    )}
                </div>


              
               
                </>
                 )}
            </div>

        <Footer />
        </div>
    );
};

export default StatementPage;