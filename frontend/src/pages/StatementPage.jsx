import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useSelectedFile } from "../contexts/SelectedFileContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatementPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); 
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cleanName, setCleanName] = useState(null);
    const [selected, setSelected] = useState("Category"); 

    const { user } = useAuth();
    const { fileName } = useSelectedFile();

    useEffect(() => {
        if (fileName) {
            const cleanedName = fileName.replace(/_(bib|txt)$/i, "");
            setCleanName(cleanedName);
        }
        }, [fileName]);


    useEffect(() => {

        if (!user || !fileName) return;

        const fetchData = async () => {
            const token = await user.getIdToken();

            try {
                const response = await fetch(`${API_BASE_URL}/cds/get-statements?fileName=${fileName}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`, 
                    },
                });
        
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
        
                const result = await response.json(); 
                setData(result); //store data in state
        
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
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
              <div className="text-white">Loading...</div>
            ) : error ? (
              <p className="text-white text-lg bg-red-600 p-3 rounded-md">Error: {error}</p>
            ) : (
              <>
                <div className="h-[13vh] flex items-center justify-center">
                  <h1 className="text-4xl md:text-5xl text-white font-semibold text-center">
                    Your Citation Diversity Statements – {cleanName}
                  </h1>
                </div>
      
                {data === null ? (
                    <p className="text-white text-lg">No statements found.</p>
                    ) : (
                    <>
                        {/* Tab Buttons */}
                        <div className="flex justify-center gap-8 mb-8">
                        {["Category", "Gender", "Abbreviated"].map((tab) => (
                            <button
                            key={tab}
                            onClick={() => setSelected(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                                selected === tab
                                ? "bg-yellow text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                            }`}
                            >
                            {tab}
                            </button>
                        ))}
                        </div>

                        {/* Selected Statement */}
                        <div className="space-y-6 w-full max-w-4xl mb-10">
                        {selected === "Category" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                            <h2 className="text-3xl font-semibold text-center py-2">
                                Full Citation Diversity Statement - By Author Categories
                            </h2>
                            <p>{data.catStatement}</p>
                            </div>
                        )}
                        {selected === "Gender" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                            <h2 className="text-3xl font-semibold text-center py-2">
                                Full Citation Diversity Statement - By Gender
                            </h2>
                            <p>{data.genderStatement}</p>
                            </div>
                        )}
                        {selected === "Abbreviated" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                            <h2 className="text-3xl font-semibold text-center py-2">
                                Abbreviated Citation Diversity Statement
                            </h2>
                            <p>{data.abbStatement}</p>
                            </div>
                        )}
                        </div>

                        {/* Always Visible Citations */}
                        <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30 w-full max-w-4xl mb-20">
                        <h2 className="text-lg font-semibold text-center">Citations</h2>
                        <ol className="list-decimal text-sm list-inside">
                            {Object.entries(data.citations).map(([key, citation]) => (
                            <li key={key} className="text-gray-300 py-1">{citation}</li>
                            ))}
                        </ol>
                        </div>
                    </>
                    )}
              </>
            )}
          </div>
      
          <Footer />
        </div>
      );
};

export default StatementPage;