import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom"; // Import navigation hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserFiles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    if (user) {
      try {
        const token = await user.getIdToken();

        const response = await fetch(`${API_BASE_URL}/user/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError("Could not fetch files.");
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchFiles();
  }, [user]);

  const handleDeleteFile = async (fileName) => {
    if (user?.uid && fileName) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/upload/delete-file?userId=${user.uid}&fileName=${fileName}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to delete file");
        }
  
        const data = await response.json();
        fetchFiles();
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
  };

  // Navigate to the results page and pass `fileName`
  const handleSeeResults = (fileName) => {
    navigate("/results", {
      state: { fileName},
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg pl-8 pr-4 py-4">
      <h1 className="text-3xl text-center pb-2">Previous Analyses</h1>

      {loading ? (
        <p>Loading files...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : files.length > 0 ? (
        <div className="overflow-x-auto pr-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Filename</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Upload Date</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Download</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Results</th>
              </tr>
            </thead>
            <tbody>
              {files.map(({ fileName, ogName, uploadDate, downloadUrl }, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{ogName}</td>
                  <td className="border border-gray-300 px-4 py-2">{uploadDate}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {downloadUrl ? (
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">Unavailable</span>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleSeeResults(fileName)}
                      className="text-blue hover:underline"
                    >
                      Open
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button 
                      onClick={() => handleDeleteFile(fileName)}
                      className="bg-red/70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red transition">
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default UserFiles;

