import React, { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar.jsx';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Loader from '../components/Loader.jsx';
import Typewriter from '../components/TypewriterRelated.jsx';

const RelatedPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar State
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Function to Toggle Sidebar

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
          // Step 1: Check if data exists in Firebase
          try {
              const storedResponse = await fetch(`http://localhost:5000/related/get-related-works?fileName=${fileName}&userId=${userId}`);

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

          // Step 2: If no stored data, call process-related-works API
          try {
              const response = await fetch("http://localhost:5000/related/process-related-works", {
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
              setError(error.message);
          } finally {
              setLoading(false);
          }
          
      };

      fetchData();
  }, [ navigate]);


    return (
        <div>
            <Navbar />
            <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />

            <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)]">


                {loading ? (
                  <>
                    <div className="h-[20vh] flex items-center justify-center">
                        <div className=" text-white flex flex-col text-center">
                            <div className="text-5xl font-semibold ">Hold Tight...</div>
                            <div className="text-lg pt-2">Searching for related works!</div>
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
                <div className="h-[13vh] flex items-center justify-center">
                    <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
                        Related Articles
                    </h1>
                </div>

                      {data.length === 0 ? (
                    <p className="text-white text-lg">No related articles found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-20">
                      {data.map((paper, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30"
                        >
                          <h2 className="text-lg font-semibold">{paper.title}</h2>
                          <p className="mt-2 text-sm">
                            Publication Date: {paper.publicationDate || "N/A"}
                          </p>
                          <p className="mt-2 text-sm">
                            Citation Count: {paper.citationCount}
                          </p>
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-300 underline block"
                          >
                            View Paper
                          </a>
                          <div className="mt-3">
                            <p className="font-semibold">Authors:</p>
                            {paper.authors && paper.authors.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {paper.authors.map((author, idx) => (
                                  <li key={idx}>
                                    <span
                                      className={`font-semibold ${
                                        author.gender === "M"
                                          ? "text-[#29C2E0]"
                                          : author.gender === "W"
                                          ? "text-[#FF6384]"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {author.name}
                                    </span>{" "}
                                    <span
                                      className={`text-sm ${
                                        author.gender === "M"
                                          ? "text-[#29C2E0]"
                                          : author.gender === "W"
                                          ? "text-[#FF6384]"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      ({author.gender || "Unknown"})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400">No authors info.</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
          
                </>
                 )}
            </div>

        <Footer />
        </div>
    );
};

export default RelatedPage;
