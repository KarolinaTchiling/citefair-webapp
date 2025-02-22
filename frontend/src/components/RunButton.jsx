import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";


const RunButton = ({ fileName, firstName, lastName, disabled }) => {
    const navigate = useNavigate(); // Access the navigate function
    const { user } = useAuth();

    const handleClick = async () => {
        try {

            const response = await fetch("http://localhost:5000/stats/processBib", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName: fileName,
                    userId: user.uid,
                    firstName: firstName,
                    lastName: lastName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json(); // Parse response JSON

            // Navigate to /results and pass the response data
            navigate(`/results`, { state: { resultData: data } });

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={disabled} // Disable the button if disabled is true
                className={`w-full py-2 px-4 rounded-md focus:outline-none mt-2 ${
                    disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue text-white font-[500] hover:bg-blue/80"
                }`}
            >
                Run CiteFairly
            </button>
        </div>  
    )
}

export default RunButton;
