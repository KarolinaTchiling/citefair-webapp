import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import GenerateStatementsButton from "../components/GenerateStatementsButton";

const FileUploadComponent = () => {
    const { user, isAuthenticated } = useAuth();
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadedFile, setUploadFile] = useState("");
    const [fileUploaded, setFileUploaded] = useState(false); 

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
            const folderRef = ref(storage, `users/${user.uid}/uploads`);
            const fileRef = ref(storage, `users/${user.uid}/uploads/${file.name}`);

             // Check if the file already exists
            const existingFiles = await listAll(folderRef);
            const fileExists = existingFiles.items.some(item => item.name === file.name);

            if (fileExists) {
                setUploadStatus(`A file with the name "${file.name}" already exists.`);
                return; // Stop execution
            }

            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const uniqueKey = `${Date.now()}_${file.name.replace(/[.#$/[\]]/g, "_")}`;
            const db = getDatabase();

            await set(dbRef(db, `users/${user.uid}/files/${uniqueKey}`), {
                url: downloadURL,
                originalFileName: file.name,
                uploadedAt: new Date().toISOString(),
            });

            setUploadStatus("File uploaded successfully!");
            setFileUploaded(true);
            setUploadFile(file.name)
            setFile(null); // Clear the file input
        } catch (error) {
            setUploadStatus("File upload failed: " + error.message);
            setFileUploaded(false); 
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
            {uploadStatus && <p className="text-center text-green-600 font-medium mt-2">{uploadStatus}</p>}
            <button
                onClick={handleUpload}
                className="w-full bg-blue text-white py-2 px-4 rounded-md hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
            >
                Upload
            </button>
            <div className="">
                <GenerateStatementsButton fileName={uploadedFile} disabled={!fileUploaded}/>
            </div>
        </div>
    );
};

export default FileUploadComponent;