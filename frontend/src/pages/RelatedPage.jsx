import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Typewriter from "../components/Typewriter";

const RelatedPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states:
  const [filterAnyWoman, setFilterAnyWoman] = useState(false);
  const [filterFirstOrLastWoman, setFilterFirstOrLastWoman] = useState(false);

  useEffect(() => {
    const sessionUserData = sessionStorage.getItem("userData");
    if (!sessionUserData) {
      console.error("Missing required session data, redirecting...");
      navigate("/");
      return;
    }
    const { fileName, userId } = JSON.parse(sessionUserData);

    const fetchData = async () => {
      // Try GET request first
      try {
        const storedResponse = await fetch(
          `http://localhost:5000/related/get-related-works?fileName=${fileName}&userId=${userId}`
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
        const response = await fetch("http://localhost:5000/related/process-related-works", {
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
                Related Articles
              </h1>
            </div>

            {/* Filter Options */}
            <div className="flex gap-4 mb-6">
              <label className="text-white">
                <input
                  type="checkbox"
                  checked={filterAnyWoman}
                  onChange={(e) => setFilterAnyWoman(e.target.checked)}
                />{" "}
                At least one woman author
              </label>
              <label className="text-white">
                <input
                  type="checkbox"
                  checked={filterFirstOrLastWoman}
                  onChange={(e) => setFilterFirstOrLastWoman(e.target.checked)}
                />{" "}
                Woman in first or last position
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
                    className="border border-gray-300 p-4 rounded-lg shadow-md text-white bg-black/30"
                  >
                    <h2 className="text-lg font-semibold">{paper.title}</h2>
                    <p className="mt-2 text-sm">
                      Publication Date: {paper.publicationDate || "N/A"}
                    </p>
                    <p className="mt-2 text-sm">Citation Count: {paper.citationCount}</p>
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
