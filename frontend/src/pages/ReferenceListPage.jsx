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
    const [cleanName, setCleanName] = useState(null);

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

        const cleanedName = fileName.replace(/_(bib|txt)$/i, "");
        setCleanName(cleanedName);
      
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
            method: "DELETE",
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

      const handleDownloadReference = async () => {
        const sessionUserData = sessionStorage.getItem("userData");
        if (!sessionUserData) {
          console.error("Missing user data");
          return;
        }
      
        const { userId, fileName } = JSON.parse(sessionUserData);
      
        try {
          const response = await fetch(`${API_BASE_URL}/ref/download-ref`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: userId, fileName }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData.error || "Failed to export references.");
            return;
          }
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
      
          let versionedFileName = "references.bib";
          const contentDisposition = response.headers.get("Content-Disposition");
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) {
              versionedFileName = filenameMatch[1];
            }
          }
      
          console.log("⬇Downloading as:", versionedFileName);
      
          const link = document.createElement("a");
          link.href = url;
          link.download = versionedFileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      
          toast.success(`Downloaded ${versionedFileName}!`);
        } catch (error) {
          console.error("Request failed:", error);
          toast.error("Something went wrong while exporting the file.");
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
                        Your References - {cleanName}
                    </h1>
                </div>
                <div className="text-md text-white text-center w-full max-w-4xl flex flex-col gap-6">
                    <p>
                        The following is your reference list. It includes all the references from your originally uploaded bibliography, along with any additional articles you've added from the Recommended Articles page.
                    </p>

                    <div className="bg-white/10 rounded-lg p-4 text-left">
                        <h3 className="text-lg font-semibold text-yellow mb-2">How to Use:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-white">
                        <li>
                            Click the <span className="font-bold text-yellow">&nbsp;✖&nbsp;</span> button at the bottom right of any paper to remove it from your reference list.
                        </li>
                        <li>
                            Open the collapsible drawer on the left and select <span className="italic text-yellow">&nbsp;"Recommended Articles"&nbsp;</span> to add more references. Newly added articles will appear at the bottom of this list with a <span className="font-bold text-white">&nbsp;★★ New ★★&nbsp;</span> label.
                        </li>
                        <li>
                            Once you're happy with your updated reference list, click the <span className="font-semibold text-yellow">&nbsp;Download&nbsp;</span> button below to export it as a BibTeX file.
                        </li>
                        <li>
                            Return to your dashboard by opening the collapsible drawer on the left and selecting <span className="italic text-yellow">&nbsp;"Return to Dashboard"&nbsp;</span>. Upload your downloaded BibTeX file and re-run <span className="font-semibold text-yellow">&nbsp;CiteFairly&nbsp;</span> to generate an updated citation analysis and diversity statement.
                        </li>
                        </ul>
                    </div>
                </div>

                <div className="self-center gap-10 items-end flex flex-row my-6">
                    <div className="text-white text-lg">
                        Total References: {papers?.length || 0}
                    </div>
                    <button 
                        onClick={() => handleDownloadReference()}
                        className=" py-2 px-14 text-xl rounded-md shadow-md text-black bg-yellow hover:bg-yellow/60 hover:text-black transition duration-200">Download
                    </button>
                    
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