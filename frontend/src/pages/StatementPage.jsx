import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useSearchParams } from "react-router-dom";


function StatementPage() {

    const [searchParams] = useSearchParams(); // Access query parameters
    const fileName = searchParams.get("fileName"); // Retrieve fileName from the URL
    const { user, isAuthenticated } = useAuth();
    const [data, setData] = useState(null); // State to store API response
    const [error, setError] = useState(null); // State to store errors
    const [loadingMessage, setLoadingMessage] = useState(null); // State for the loading message

    
    const filePath = `users/${user.uid}/uploads/${fileName}`;
    console

    const generateMessages = () => {
        const initialMessages = [
            "Parsing reference list...",
            "Parsing reference list.",
            "Parsing reference list...",
            "Parsing reference list.",
            "Assigning genders to authors...",
            "Assigning genders to authors.",
            "Assigning genders to authors...",
            "Assigning genders to authors.",
            "Calculating statistics...",
            "Calculating statistics.",
            "Calculating statistics...",
            "Calculating statistics.",
        ];
    
        return initialMessages;
    };
    
    const callGetCds = async () => {
        if (!isAuthenticated) {
            setError("User not authenticated");
            return;
        }

        await user.getIdToken(true);; // Forces token refresh
        console.log(user)
    
        const initialMessages = generateMessages();
        const lastStepMessage = "Generating your Citation Diversity Statements";
        let apiCompleted = false;
    
        // Show initial messages
        const showInitialMessages = async () => {
            for (let i = 0; i < initialMessages.length; i++) {
                setLoadingMessage(initialMessages[i]);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second per message
            }
        };
    
        // Show the last step messages until the API call completes
        const showLastStepMessages = async () => {
            let iteration = 0;
            const variations = [
                `${lastStepMessage}...`,
                `${lastStepMessage}.`,
                `${lastStepMessage}..`,
                `${lastStepMessage}.`,
            ];
    
            while (!apiCompleted) {
                setLoadingMessage(variations[iteration % variations.length]);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second per variation
                iteration++;
            }
        };
    
        // Start showing loading messages
        showInitialMessages().then(() => showLastStepMessages()); // Transition to last step messages
    
        try {
            const response = await fetch("http://localhost:5000/api/get-cds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({ filepath: filePath}),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseData = await response.json();
            setData(responseData.response); // Set the response data to state
        } catch (err) {
            setError(err.message); // Capture and set the error
        } finally {
            apiCompleted = true; // Stop the last step messages
            setLoadingMessage(null); // Clear the loading message
        }
    };
    
    useEffect(() => {
        callGetCds();
    }, []); // Empty dependency array ensures it runs only once when the component mounts

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-6">Citation Diversity Statements</h1>

            {loadingMessage && <p className="text-center text-blue-500">{loadingMessage}</p>} {/* Show loading message */}
            {error && <p className="text-center text-red-500">{error}</p>} {/* Show error message */}

            {data && (
                <div className="space-y-8">
                    {/* Category and General Statements Section */}
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Category Statistics and Statement */}
                        <section className="bg-white p-6 rounded-lg shadow-md flex-1">
                            <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
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
                            <h3 className="text-lg font-medium mt-6">Category Statement</h3>
                            <p className="text-gray-700 mt-2">{data.category_statement}</p>
                        </section>

                        {/* General Statistics and Statement */}
                        <section className="bg-white p-6 rounded-lg shadow-md flex-1">
                            <h2 className="text-xl font-semibold mb-4">General Statistics</h2>
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
                            <h3 className="text-lg font-medium mt-6">General Statement</h3>
                            <p className="text-gray-700 mt-2">{data.general_statement}</p>
                        </section>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Abbreviated Statement Section */}
                        <section className="bg-white p-6 rounded-lg shadow-md md:w-1/4">
                            <h2 className="text-xl font-semibold mb-4">Abbreviated Statement</h2>
                            <p className="text-gray-700">{data.abbreviated_statement}</p>
                        </section>

                        {/* References Section */}
                        <section className="bg-white p-6 rounded-lg shadow-md md:w-3/4">
                            <h2 className="text-xl font-semibold mb-4">References</h2>
                            <ul className="list-disc list-inside space-y-2">
                                {Object.entries(data.references).map(([key, value]) => (
                                    <li key={key} className="text-gray-700">
                                        <strong>[{key}]</strong> {value}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StatementPage;