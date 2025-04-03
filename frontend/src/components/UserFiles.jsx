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

  useEffect(() => {
    const fetchFiles = async () => {
      if (user?.uid) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/files`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: user.uid }),
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
    };

    fetchFiles();
  }, [user]);

  console.log(files);

  // Navigate to the results page and pass `fileName` & `userId`
  const handleSeeResults = (fileName) => {
    navigate("/results", {
      state: { userData: { fileName, userId: user.uid } },
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
                <th className="border border-gray-300 px-4 py-2 text-center">See Results</th>
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
                      See Results
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

