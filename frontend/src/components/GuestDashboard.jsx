import { useState } from "react";
import { useAuth } from "../AuthContext";
import FileUploadComponent from "./Upload";
import RunButton from "./RunButton";

function GuestDashboard() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(""); // User enters first name
  const [middleName, setMiddleName] = useState(""); // User enters first name
  const [lastName, setLastName] = useState(""); // User enters last name
  const [uploadedFile, setUploadedFile] = useState(""); // Track uploaded file
  const [fileUploaded, setFileUploaded] = useState(false); // Track file status
  const { login, continueAsGuest } = useAuth();

  const [showUploadSection, setShowUploadSection] = useState(false); // Track section visibility

  console.log(user?.uid);

  const handleContinueAsGuest = async (e) => {
    e.preventDefault(); // Prevents the form from refreshing
    await continueAsGuest(firstName, middleName, lastName); // Ensure the function completes
    setShowUploadSection(true); // Update the UI
  };

  console.log(uploadedFile);
  return (
    <div className="">
      <div className="h-full w-full flex flex-col bg-white rounded-lg p-8 pb-4">
        <div className="flex-grow flex flex-col">

          {/* Show Name Input Section if Upload Section is NOT visible */}
          {!showUploadSection && (
            <form onSubmit={handleContinueAsGuest} className="flex-grow flex flex-col">
              <div className="text-gray-800 text-xl text-center mb-6">
                <p className="text-base">
                  In order to remove self-citation biases from our analysis, you must
                  enter the first and last name under which you publish.
                </p>
              </div>

              <div className="flex-grow flex flex-col">
                {/* First Name Input */}
                <div className="mb-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    placeholder=""
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Middle Name Input */}
                <div className="mb-3">
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    value={middleName}
                    placeholder=""
                    onChange={(e) => setMiddleName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>                

                {/* Last Name Input */}
                <div className="mb-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    placeholder=""
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-auto mb-4 text-center">
                <button 
                  type="submit"
                  className="mt-auto w-full bg-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue/80"
                >
                  Continue as a Guest
                </button>
              </div>
            </form>
          )}

          {/* Show Upload Section if Continue as Guest is clicked */}
          {showUploadSection && (
            <div className="flex-grow flex flex-col">
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
          )}

        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;

