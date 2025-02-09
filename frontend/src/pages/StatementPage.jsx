import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function StatementPage() {

    const [searchParams] = useSearchParams(); // Access query parameters
    const fileName = searchParams.get("fileName"); // Retrieve fileName from the URL
    const { user, isAuthenticated } = useAuth();
    const [data, setData] = useState(null); // State to store API response
    const [error, setError] = useState(null); // State to store errors
    const [loadingMessage, setLoadingMessage] = useState(null); // State for the loading message
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/related");
    };
      

    const callGetCds = async () => {
        try {
            // Use the correct file path or dynamic query parameter from the URL
            const filePath = "users/NYj6VmrnlaXU8bgwPjb4z5nDZrz1/uploads/APSECrefs.bib";
    
            setLoadingMessage("Fetching titles...");
            const titlesResponse = await fetch("http://localhost:5000/cds/get-titles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filepath: filePath }),
            });
            const titles = await titlesResponse.json();
    
            setLoadingMessage("Fetching papers from Open Alex...");
            const papersResponse = await fetch("http://localhost:5000/cds/get-papers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(titles),
            });
            const papers = await papersResponse.json();
    
            setLoadingMessage("Labeling authors with Gender-api...");
            const labelledPapersResponse = await fetch("http://localhost:5000/cds/get-gendered-papers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(papers),
            });
            const labelledPapers = await labelledPapersResponse.json();
    
            setLoadingMessage("Calculating statistics...");
            const statsResponse = await fetch("http://localhost:5000/cds/get-gender-stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(labelledPapers),
            });
            const stats = await statsResponse.json();
    
            setLoadingMessage("Fetching statements...");
            const statementsResponse = await fetch("http://localhost:5000/cds/get-statements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stats),
            });
            const statements = await statementsResponse.json();
    
            setData(statements.cds); // Update the final data
            setLoadingMessage(null); // Clear the loading message
        } catch (error) {
            console.error("Error in callGetCds:", error);
            setError("An error occurred while fetching data. Please try again later.");
            setLoadingMessage(null); // Clear the loading message
        }
    };
    
    
    useEffect(() => {
        callGetCds();
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-6">Citation Diversity Statements</h1>

        <button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
            Discover Related Papers
        </button>

        {loadingMessage && (
            <div className="mt-4 text-center">
                <p className="text-blue-500">{loadingMessage}</p>
                <div className="w-64 h-2 mx-auto bg-gray-200 rounded">
                    <div className="h-2 bg-blue-500 rounded animate-pulse"></div>
                </div>
            </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {data && (
            <div className="space-y-8">
                {/* Category Statistics and Statement Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
                    {data.category_data ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.category_data).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="border border-gray-300 px-4 py-2">{key}</td>
                                        <td className="border border-gray-300 px-4 py-2">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No category data available.</p>
                    )}
                    <h3 className="text-lg font-medium mt-6">Category Statement</h3>
                    <p className="text-gray-700 mt-2">{data.fullCategories || "No category statement available."}</p>
                </section>

                {/* General Statistics and Statement Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">General Statistics</h2>
                    {data.general_data ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.general_data).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className="border border-gray-300 px-4 py-2">{key}</td>
                                        <td className="border border-gray-300 px-4 py-2">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No general data available.</p>
                    )}
                    <h3 className="text-lg font-medium mt-6">General Statement</h3>
                    <p className="text-gray-700 mt-2">{data.fullGeneral || "No general statement available."}</p>
                </section>

                {/* Abbreviated Statement Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Abbreviated Statement</h2>
                    <p className="text-gray-700">{data.abbreviated || "No abbreviated statement available."}</p>
                </section>

                {/* References Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">References</h2>
                    {data.references ? (
                        <ul className="list-disc list-inside space-y-2">
                            {Object.entries(data.references).map(([key, value]) => (
                                <li key={key} className="text-gray-700">
                                    <strong>[{key}]</strong> {value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No references available.</p>
                    )}
                </section>

                {/* Missing Titles Section */}
                {data.missing && data.missing.titles && (
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Missing Titles</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {data.missing.titles.map((title, index) => (
                                <li key={index} className="text-gray-700">
                                    {title}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        )}
    </div>
);
}

export default StatementPage;