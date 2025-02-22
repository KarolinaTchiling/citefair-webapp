import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
    const location = useLocation();
    const resultData = location.state?.resultData; // Retrieve the data passed from RunButton

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Results</h1>
            {resultData ? (
                <pre className="mt-4 p-4 bg-gray-100 rounded-md">
                    {JSON.stringify(resultData, null, 2)}
                </pre>
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default ResultsPage;
