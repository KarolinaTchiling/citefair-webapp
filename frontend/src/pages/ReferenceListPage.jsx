import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReferenceListPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const sessionUserData = sessionStorage.getItem("userData");

    useEffect(() => {

        const sessionUserData = sessionStorage.getItem("userData");

 
        if (!sessionUserData) {
            console.error("Missing required session data, redirecting...");
            navigate("/");
            return;
        }

        const userData = JSON.parse(sessionUserData);
        const fileName = userData.fileName;
        const userId = userData.userId;

        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/stats/getProcessedBib?fileName=${fileName}&userId=${userId}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await response.json();
                setData(result);
            
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load reference list.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);


    const papers = data?.papers || [];

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
                        Your References
                    </h1>
                </div>

                <div> 
                    {papers.length === 0 ? (
                        <p className="text-white text-lg">No references found.</p>
                    ) : (
                        <div className="space-y-6 w-full max-w-4xl mb-20">
                            {papers.map((paper, index) => (
                                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                    <h2 className="text-lg font-semibold">{paper.title}</h2>
                                    <h4 className="text-sm pt-1">
                                        <a 
                                            href={`https://doi.org/${paper.doi}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline"
                                        >
                                            {paper.doi}
                                        </a>
                                    </h4>


                                    <div className="mt-3">
                                        <p className="font-semibold">Authors:</p>
                                        {paper.authors && paper.authors.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {paper.authors.map((author, idx) => (
                                                <li key={idx}>
                                                <span
                                                    className={`text-sm ${
                                                        author.gender === "M"
                                                            ? "text-[#29C2E0]"
                                                            : author.gender === "W"
                                                            ? "text-[#FF6384]"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {author.name} - {author.gender} ({author.prob})
                                                </span>
                                                    
                                                </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-400">No match found.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
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

export default ReferenceListPage;