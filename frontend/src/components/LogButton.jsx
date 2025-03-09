import React from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LogButton = () => {
  const { user, logout } = useAuth(); // Get user & logout function from context
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logout(navigate);
      console.log("User logged out!");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div>
      {user ? (
        // 🔹 Show "Log Out" Button If Logged In
        <button
          className="px-8 py-1 text-md text-white bg-red font-[500] rounded-md hover:bg-red/80 transition duration-200"
          onClick={handleLogout}
        >
          Log Out
        </button>
      ) : (
        // 🔹 Show "Log In" Button If Logged Out
        <button
          className="px-8 py-1 text-md text-white bg-blue font-[500] rounded-md hover:bg-blue/80 transition duration-200"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default LogButton;
