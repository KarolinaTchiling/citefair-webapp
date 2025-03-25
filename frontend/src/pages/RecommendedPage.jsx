import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/Loader.jsx";
import Typewriter from "../components/TypewriterRelated.jsx";
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RecommendedPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cleanName, setCleanName] = useState(null);

  // Filter states:
  const [filterAnyWoman, setFilterAnyWoman] = useState(false);
  const [filterFirstOrLastWoman, setFilterFirstOrLastWoman] = useState(false);
  const [filterFirstAndLastWoman, setFilterFirstAndLastWoman] = useState(false);

  useEffect(() => {
    const sessionUserData = sessionStorage.getItem("userData");
    if (!sessionUserData) {
      console.error("Missing required session data, redirecting...");
      navigate("/");
      return;
    }
    const { fileName, userId } = JSON.parse(sessionUserData);
    const cleanedName = fileName.replace(/_(bib|txt)$/i, "");
    setCleanName(cleanedName);

    const fetchData = async () => {
      // Try GET request first
      try {
        const storedResponse = await fetch(
          `${API_BASE_URL}/related/get-related-works?fileName=${fileName}&userId=${userId}`
        );
        if (storedResponse.ok) {
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

      // Fallback to POST request if no stored data
      try {
        const response = await fetch(`${API_BASE_URL}/related/process-related-works`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName, userId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddReference = async (paperId) => {
    const sessionUserData = sessionStorage.getItem("userData");
    if (!sessionUserData) {
      console.error("Missing user data");
      return;
    }
  
    const { userId, fileName } = JSON.parse(sessionUserData);
  
    try {
      const response = await fetch(`${API_BASE_URL}/ref/add-ref`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, fileName, paperId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Paper added to reference list:", data.paper);
        toast.success("Article added to reference list!");
      } else {
        console.error("Error adding reference:", data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  // Filter the data based on selected filter options.
  const filteredData = data.filter((paper) => {
    let include = true;
    // Filter for at least one woman author
    if (filterAnyWoman) {
      include = include && paper.authors && paper.authors.some(author => author.gender === "W");
    }
    // Filter for woman in first or last position
    if (filterFirstOrLastWoman) {
      include =
        include &&
        paper.authors &&
        paper.authors.length > 0 &&
        (paper.authors[0].gender === "W" || paper.authors[paper.authors.length - 1].gender === "W");
    }
    // Filter for woman in first or last position
    if (filterFirstAndLastWoman) {
      include =
        include &&
        paper.authors &&
        paper.authors.length > 0 &&
        (paper.authors[0].gender === "W" && paper.authors[paper.authors.length - 1].gender === "W");
    }
    return include;
  });

  return (
    <div>
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleSidebar} />

      <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)]">
        {loading ? (
          <>
            <div className="h-[20vh] flex items-center justify-center">
              <div className="text-white flex flex-col text-center">
                <div className="text-5xl font-semibold">Hold Tight...</div>
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
                Recommended Articles - {cleanName}
              </h1>
            </div>
            
            <div className="text-md text-white text-center w-full max-w-5xl pb-8 px-4 flex flex-col gap-6">
              <p>
                The following articles are recommended by <span className="font-semibold">Semantic Scholar</span> based on their relevance to the papers in your reference list. These suggestions are generated using citation networks, content similarity, and co-authorship patterns. All articles have been published within the last 60 days, and author genders have been labeled using <span className="font-semibold">Gender-API</span>.
              </p>

              <div className="bg-white/10 rounded-lg p-4 text-left">
                <h3 className="text-lg font-semibold text-yellow mb-2">How to Use:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-white">
                  <li>
                    Use the filters below to highlight articles by specific gender categories and discover new publications authored by women.
                  </li>
                  <li>
                    Click the <span className="font-bold text-yellow"> &nbsp;+&nbsp; </span> button in the bottom right of each paper to add it to your reference list.
                  </li>
                  <li>
                    Open the collapsible drawer to left and select <span className="italic text-yellow">&nbsp;"Reference List" &nbsp;</span> to view or edit your reference list.
                  </li>
                  <li>
                    From there, export your updated references as a BibTeX file and re-run <span className="font-semibold text-yellow">&nbsp;CiteFairly&nbsp;</span> to generate an updated citation analysis and diversity statement.
                  </li>
                </ul>
              </div>
            </div>
    

            {/* Filter Options */}
            <div className="flex gap-8 mb-6">

              <label className="text-white">
                <input
                  type="checkbox"
                  checked={filterFirstAndLastWoman}
                  onChange={(e) => setFilterFirstAndLastWoman(e.target.checked)}
                />{" "}
                Woman in first AND last position
              </label>

              <label className="text-white">
                <input
                  type="checkbox"
                  checked={filterFirstOrLastWoman}
                  onChange={(e) => setFilterFirstOrLastWoman(e.target.checked)}
                />{" "}
                Woman in first OR last position
              </label>

              <label className="text-white">
                <input
                  type="checkbox"
                  checked={filterAnyWoman}
                  onChange={(e) => setFilterAnyWoman(e.target.checked)}
                />{" "}
                At least ONE woman author
              </label>

            </div>

            {filteredData.length === 0 ? (
              <p className="text-white text-lg">
                No related articles found with current filters.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-20">
                {filteredData.map((paper, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30"
                  >
                    <div>
                      <h2 className="text-lg font-semibold">{paper.title}</h2>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-300 underline block"
                      >
                        View Paper
                      </a>
                      <div className="mt-3">
                        <p className="font-medium">Authors:</p>
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
                          <p className="text-gray-400">No authors info.</p>
                        )}
                      </div>
                    </div>


                    <div className="self-end font-semibold -mt-8">
                      <button 
                      onClick={() => handleAddReference(paper.paperId)}
                      className="border border-gray-300 h-10 w-10 rounded-full shadow-md text-white bg-black/80 hover:bg-yellow hover:text-black transition duration-200">+</button>
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

export default RecommendedPage;
