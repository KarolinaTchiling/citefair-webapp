import { useState } from "react";
import { useAuth } from "../AuthContext";
import { getDatabase, ref, set } from "firebase/database";
import FileUploadComponent from "./Upload";

function GuestDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  console.log(user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setUploadStatus("User not authenticated");
      return;
  }

    try {
      const db = getDatabase();
      await set(ref(db, `guests/${user.uid}`), {
        firstName: firstName,
        lastName: lastName,
      });

      alert("Name saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    }
  };

    return (
      <div className="">
        <div className="h-full w-full flex flex-col bg-white rounded-lg p-8 pb-4">
          <div className="flex-grow flex flex-col">
            {/* Box 1: User Info */}
            <div className="">
              <div className="text-gray-800 text-xl text-center mb-6">
                <p className="text-base">
                  In order to remove self-citation biases from our analysis, please
                  enter the first and last name under which you publish.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col" >
                  {/* First Name Input */}
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      placeholder="Enter your first name"
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>

                  {/* Last Name Input */}
                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                  </div>
          

                    {/* Submit Button
                    <button
                      type="submit"
                      className="w-full bg-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2"
                    >
                      Submit
                    </button> */}
              </form>

            </div>
            
            {/* Box 2: Guest Upload Page */}
            <div className="mt-auto mb-0">
              <FileUploadComponent />
            </div>
          </div>
        </div>
      </div>
    );
}

export default GuestDashboard;