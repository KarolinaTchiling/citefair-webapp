import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import FileUploadComponent from "./Upload";
import RunButton from "./RunButton";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function FileUploadAnalysis() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(""); // Track uploaded file
  const [fileUploaded, setFileUploaded] = useState(false); // Track file status

  useEffect(() => {
    const fetchUserName = async () => {
      if (user?.uid) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setFirstName(data.firstName || "");
          setMiddleName(data.middleName || "");
          setLastName(data.lastName || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, [user]);

  return (

      <div className="h-full w-full flex flex-col bg-white rounded-lg px-8 py-4">

        <div className="flex-grow flex flex-col">
            <h1 className="text-3xl text-center pb-2">
                Run a New Reference List Analysis
            </h1>

          <div className="text-gray-800 text-xl text-center mb-8">
            <p className="text-base">
              Upload your reference list to analyze gender biases, broaden your sources, and generate citation diversity statements.
            </p>
          </div>

          <FileUploadComponent setUploadedFile={setUploadedFile} setFileUploaded={setFileUploaded} />

          <div className="mt-auto mb-4"> 
            <RunButton
              fileName={uploadedFile}
              firstName={firstName}
              middleName={middleName}
              lastName={lastName}
              disabled={!fileUploaded || !firstName || !lastName}
            />
          </div>
        </div>
      </div>
  );
}

export default FileUploadAnalysis;
