import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReferenceListPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        const sessionUserData = sessionStorage.getItem("userData");
      
        if (!sessionUserData) {
          console.error("Missing required session data, redirecting...");
          navigate("/");
          return;
        }
      
        const userData = JSON.parse(sessionUserData);
        const fileName = userData.fileName;
        const userId = userData.userId;
      
        try {
          const response = await fetch(`${API_BASE_URL}/ref/get-refs?fileName=${fileName}&userId=${userId}`);
      
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
    
    useEffect(() => {
        fetchData();
      }, [navigate]);
    

    const handleDeleteReference = async (title) => {
        const sessionUserData = sessionStorage.getItem("userData");
        if (!sessionUserData) {
          console.error("Missing user data");
          return;
        }
      
        const { userId, fileName } = JSON.parse(sessionUserData);
      
        try {
          const response = await fetch(`${API_BASE_URL}/ref/delete-ref`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: userId, fileName, title }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log("Article deleted from reference list:", data.paper);
            toast.success("Article deleted from reference list!");
            fetchData();

          } else {
            console.error("Error adding reference:", data.error);
            toast.error(data.error);
          }
        } catch (error) {
          console.error("Request failed:", error);
        }
      };


    const papers = data || [];

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
                                <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30 flex flex-col">
                                    {paper.url && (
                                    <h2 className="text-2xl text-center font-semibold text-yellow-400">★★ New ★★</h2>
                                    )}
                                    <h2 className="text-lg font-semibold">{paper.title} </h2>
                                    <h4 className="text-sm pt-1">
                                        <a 
                                            href={`https://doi.org/${paper.doi}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-yellow/80 hover:underline"
                                        >
                                            {paper.doi}
                                        </a>
                                    </h4>
                                    <h4 className="text-sm pt-1">
                                        <a 
                                            href={`${paper.url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-yellow/80 hover:underline"
                                        >
                                            {paper.url}
                                        </a>
                                    </h4>


                                    <div className="mt-3">
                                        <p className="font-semibold mb-1">Authors:</p>
                                        {paper.authors && paper.authors.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                            {paper.authors.map((author, idx) => (
                                                <span
                                                key={idx}
                                                className={`text-sm ${
                                                    author.gender === "M"
                                                    ? "text-[#29C2E0]"
                                                    : author.gender === "W"
                                                    ? "text-[#FF6384]"
                                                    : "text-gray-400"
                                                }`}
                                                >
                                                {author.name} - {author.gender} ({author.prob})
                                                {idx < paper.authors.length - 1 && <span>,</span>}
                                                </span>
                                            ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400">No match found.</p>
                                        )}
                                        </div>

                                    <div className="self-end">
                                        <button 
                                        onClick={() => handleDeleteReference(paper.title)}
                                        className="border border-gray-300 h-8 w-8 rounded-full shadow-md text-white bg-black/80 hover:bg-red hover:text-white transition duration-200">✖</button>
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