import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FileUploadComponent = ({ setUploadedFile, setFileUploaded }) => {
    const { user, isAuthenticated } = useAuth();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    // Handle file input change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".bib") || selectedFile.name.endsWith(".txt")) {
            setFile(selectedFile);
            setUploadStatus(""); // Clear previous status
        } else {
            setUploadStatus("Please upload a valid .bib or .txt file");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadStatus("No file selected");
            return;
        }
        if (!isAuthenticated) {
            setUploadStatus("User not authenticated");
            return;
        }

        try {
            const token = await user.getIdToken();
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/file/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setUploadStatus("File uploaded successfully!");
                setUploadedFile(data.fileName);
                setFileUploaded(true);
                setFile(null);
            } else {
                setUploadStatus("File upload failed: " + data.error);
                setFileUploaded(false);
            }
        } catch (error) {
            setUploadStatus("File upload failed: " + error.message);
            setFileUploaded(false);
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
                Upload your .bib or .txt file:
            </label>
            <label htmlFor="fileInput" className="block text-sm font-medium text-red mb-2">
                Note: CiteFairly currently has limited parsing functionality for .txt files. It can correctly parse .txt files that follow the IEEE Referencing Style or where only titles are enclosed in double quotes (""). For other reference styles, consider converting your bibliography to a .bib file format for better compatibility.
            </label>
            <input
                type="file"
                accept=".bib,.txt"
                onChange={handleFileChange}
                id="fileInput"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleUpload}
                className="w-full bg-indigo/80 text-white py-2 px-4 rounded-md hover:bg-indigo/60 mt-4"
            >
                Upload File
            </button>
            {uploadStatus && <p className="text-center text-green-600 font-sm mt-2">{uploadStatus}</p>}
        </div>
    );
};

export default FileUploadComponent;