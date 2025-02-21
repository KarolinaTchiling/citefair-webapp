import React from 'react';
import { useNavigate } from "react-router-dom";


const RunButton = ({ fileName, firstName, lastName, disabled }) => {
    const navigate = useNavigate(); // Access the navigate function

    const handleClick = () => {
        navigate(`/statements?fileName=${encodeURIComponent(fileName)}`);
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
