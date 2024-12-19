import { useState } from "react";
import { useAuth } from "../AuthContext";
import { getDatabase, ref, set } from "firebase/database";
import FileUploadComponent from "../components/Upload";

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
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="flex flex-col items-start gap-y-6">
            {/* Box 1: User Info */}
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
              <div className="text-gray-800 text-xl font-semibold text-center mb-6">
                <p className="text-2xl">Hello Guest,</p>
                <p className="text-base">
                  In order to remove self-citation biases from our analysis, please
                  enter the first and last name under which you publish.
                </p>
              </div>
              <form onSubmit={handleSubmit} >
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
          

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Submit
                    </button>
              </form>

            </div>
            

            {/* Box 2: Guest Upload Page */}
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
              <FileUploadComponent />
            </div>
          </div>
        </div>
      </div>
    );
}

export default GuestDashboard;