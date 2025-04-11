import React from 'react';
import { useNavigate } from "react-router-dom";
import { useSelectedFile } from "../SelectedFileContext";

const RunButton = ({ fileName, firstName, middleName, lastName, disabled }) => {
    const navigate = useNavigate(); 
    const { setFileName } = useSelectedFile();
    const handleClick = () => {
        // Prepare the data object
        const data = {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
        };

        // Navigate to /results and pass the data
        setFileName(fileName);
        navigate(`/results`, { state: { postData: data } });
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
    );
};

export default RunButton;


