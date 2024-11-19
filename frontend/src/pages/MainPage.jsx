import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import { auth } from "../firebase/firebaseConfig"; // Adjust the path as needed
import { Link } from 'react-router-dom';

function MainPage() {
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

    const user = auth.currentUser;
    if (!user) {
      setUploadStatus("User not authenticated");
      return;
    }

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${user.uid}/uploads/ref.bib`); // Keep original file name
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

  return (
    <div>
      <h1>Main Page</h1>
      <input type="file" accept=".bib" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      <div><Link to="/statement">See your CDS</Link></div>
    </div>
  );
}

export default MainPage;



