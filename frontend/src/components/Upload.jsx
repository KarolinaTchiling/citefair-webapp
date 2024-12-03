import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";

const FileUploadComponent = ({ user, isAuthenticated }) => {
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
            const storageRef = ref(storage, `users/${user.uid}/uploads/ref.bib`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const uniqueKey = `${Date.now()}_${file.name.replace(/[.#$/[\]]/g, "_")}`;
            const db = getDatabase();

            await set(dbRef(db, `users/${user.uid}/files/${uniqueKey}`), {
                url: downloadURL,
                originalFileName: file.name,
                uploadedAt: new Date().toISOString(),
            });

            setUploadStatus("File uploaded successfully!");
            setFile(null); // Clear the file input
        } catch (error) {
            setUploadStatus("File upload failed: " + error.message);
        }
    };

    return (
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
            <button
                onClick={handleUpload}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
            >
                Upload
            </button>
            {uploadStatus && <p className="text-center text-green-600 font-medium mt-2">{uploadStatus}</p>}
        </div>
    );
};

export default FileUploadComponent;