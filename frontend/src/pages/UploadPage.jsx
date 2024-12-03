import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { Link } from 'react-router-dom';
import { useAuth } from "../AuthContext";

function MainPage() {
    const { user, isAuthenticated } = useAuth();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    // Handle file input change
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".bib")) {
            setFile(selectedFile);
            setUploadStatus(""); // Clear previous status
        } else {
            setUploadStatus("Please upload a valid .bib file");
         }
    };

    // Function to handle file upload
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
            const storage = getStorage();
            const timestamp = Date.now();
            const storageRef = ref(storage, `users/${user.uid}/uploads/${timestamp}ref.bib`); // Keep original file name
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Use a unique sanitized key for metadata
            const uniqueKey = `${Date.now()}_${file.name.replace(/[.#$/[\]]/g, "_")}`;
            const db = getDatabase();

            await set(dbRef(db, `users/${user.uid}/files/${uniqueKey}`), {
                url: downloadURL,
                originalFileName: file.name, // Keep original file name
                uploadedAt: new Date().toISOString(),
            });

            console.log("File uploaded successfully to", downloadURL);
            setUploadStatus("File uploaded successfully!");
            setFile(null); // Clear the file input

        } catch (error) {
            console.error("File upload error:", error);
            setUploadStatus("File upload failed: " + error.message);
        }
    };
    console.log(user)
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Main Page</h1>
  
          {/* File Upload */}
          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
              Upload your .bib file:
            </label>
            <input
              type="file"
              accept=".bib"
              onChange={handleFileChange}
              id="fileInput"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
          >
            Upload
          </button>
  
          {/* Upload Status */}
          {uploadStatus && (
            <p className="text-center text-green-600 font-medium mb-4">{uploadStatus}</p>
          )}
  
          {/* Link to CDS */}
          <div className="text-center mb-6">
            <Link
              to="/statement"
              className="text-blue-600 underline hover:text-blue-800 transition"
            >
              See your CDS
            </Link>
          </div>
  
          {/* User Access Token */}
          <div className="max-w-[600px] bg-gray-50 p-4 rounded-md break-all border border-gray-300 text-sm text-gray-600">
            <p>{user.accessToken}</p>
          </div>
        </div>
      </div>
    );
}

export default MainPage;