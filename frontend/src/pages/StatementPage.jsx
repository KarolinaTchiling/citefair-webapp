import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useSelectedFile } from "../contexts/SelectedFileContext";
import toast from 'react-hot-toast';

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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          toast.success("Copied to clipboard!");
        });
    };

    const handleAddReferences = async () => {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/cds/add-cds-references?fileName=${fileName}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
          });
      
          const data = await response.json();
      
          if (response.ok) {
            toast.success("Articles added to reference list!");
          } else {
            console.error("Error adding reference:", data.error);
            toast.error(data.error);
          }
        } catch (error) {
          console.error("Request failed:", error);
        }
    };
    

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
                    Citation Diversity Statements – {cleanName}
                  </h1>
                </div>

                <div className="bg-white/10 rounded-lg p-4 text-left mb-8 max-w-5xl">
                    <h3 className="text-lg font-semibold text-yellow mb-2">Select your desired Citation Diversity Statement</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-white">
                        <li>
                        Choose from two types of statements: 
                        <span className="font-semibold text-yellow">&nbsp;Full&nbsp;</span> (includes citation analysis)
                        or 
                        <span className="font-semibold text-yellow">&nbsp;Abbreviated&nbsp;</span> (excludes citation metrics).
                        </li>
                        <li>
                        The <span className="font-semibold text-yellow">category-based</span> version shows author distribution across 
                        <span className="italic text-yellow">&nbsp;MM, MW, WM, and WW&nbsp;</span> groups.
                        </li>
                        <li>
                        The <span className="font-semibold text-yellow">gender-based</span> version shows the overall gender distribution 
                        of all authors in your reference list.
                        </li>
                        <li>
                            Citations are listed below and can be added to your reference list. 
                            <span className="block mt-1">
                                <span className="font-semibold text-yellow">Note:</span> If you choose to use them, be sure to download your updated list and re-run <span className="font-semibold text-yellow">CiteFairly</span> to generate refreshed statistics.
                            </span>
                        </li>
                    </ul>
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
                        <div className="space-y-6 w-full max-w-5xl mb-10">
                        {selected === "Category" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                <div className="flex flex-row items-center justify-between my-2">
                                    <p></p>
                                    <h2 className="text-3xl font-semibold text-center">
                                        Full Citation Diversity Statement - By Author Categories
                                    </h2>
                                    <button
                                        onClick={() => handleCopy(data.catStatement)}
                                        className=" bg-blue font-semibold px-2 py-2 rounded-full hover:bg-blue/60 transition"
                                        >
                                        <img src="/clipboard.svg" alt="Copy" className="w-5 h-5" />
                                    </button>
                                </div>
                            <p>{data.catStatement}</p>
                            </div>
                        )}
                        {selected === "Gender" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                <div className="flex flex-row items-center justify-between my-2">
                                    <p></p>
                                    <h2 className="text-3xl font-semibold text-center">
                                        Full Citation Diversity Statement - By Gender
                                    </h2>
                                    <button
                                        onClick={() => handleCopy(data.genderStatement)}
                                        className=" bg-blue font-semibold px-2 py-2 rounded-full hover:bg-blue/60 transition"
                                        >
                                        <img src="/clipboard.svg" alt="Copy" className="w-5 h-5" />
                                    </button>
                                </div>
                            <p>{data.genderStatement}</p>
                            </div>
                        )}
                        {selected === "Abbreviated" && (
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30">
                                <div className="flex flex-row items-center justify-between my-2">
                                    <p></p>
                                    <h2 className="text-3xl font-semibold text-center">
                                        Abbreviated Citation Diversity Statement
                                    </h2>
                                    <button
                                        onClick={() => handleCopy(data.abbStatement)}
                                        className=" bg-blue font-semibold px-2 py-2 rounded-full hover:bg-blue/60 transition"
                                        >
                                        <img src="/clipboard.svg" alt="Copy" className="w-5 h-5" />
                                    </button>
                                </div>
                            <p>{data.abbStatement}</p>
                            </div>
                        )}
                        </div>

                        {/* Always Visible Citations */}
                        <div className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30 w-full max-w-5xl mb-20">
                        <h2 className="text-lg font-semibold text-center">Citations</h2>
                        <ol className="list-decimal text-sm list-inside">
                            {Object.entries(data.citations).map(([key, citation]) => (
                            <li key={key} className="text-gray-300 py-1">{citation}</li>
                            ))}
                        </ol>
                        <div className="text-center">
                            <button
                                onClick={handleAddReferences}
                                className=" bg-blue text-white font-medium px-8 py-1 rounded hover:bg-blue/60 transition"
                                >
                                Add References
                            </button>
                        </div>

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