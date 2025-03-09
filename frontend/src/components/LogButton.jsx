import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LogButton = () => {
  const { user, logout } = useAuth(); // Get user & logout function from context
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);

  // ✅ Fetch guest status
  useEffect(() => {
    const fetchGuestStatus = async () => {
      if (user?.uid) {
        try {
          const response = await fetch(`${API_BASE_URL}/guest/isGuest?uid=${user.uid}`);
          if (!response.ok) throw new Error("Failed to fetch guest status");
          const data = await response.json();
          setIsGuest(data.isGuest);
        } catch (error) {
          console.error("Error fetching guest status:", error);
        }
      }
    };

    fetchGuestStatus();
  }, [user]);

  // ✅ Handle "End Session" (Delete Guest Account)
  const handleEndSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/guest/deleteGuest`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete guest session");
      }

      console.log("Guest session deleted successfully!");
      await logout(navigate); // ✅ Log out and redirect

    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  return (
    <div>
      {user ? (
        isGuest ? (
          // 🔹 Show "End Session" If User Is a Guest
          <button
            className="px-8 py-1 text-md text-black bg-yellow font-[500] rounded-md hover:bg-yellow-600 transition duration-200"
            onClick={handleEndSession}
          >
            End Session
          </button>
        ) : (
          // 🔹 Show "Log Out" If User Is Logged In & Not a Guest
          <button
            className="px-8 py-1 text-md text-white bg-red font-[500] rounded-md hover:bg-red/80 transition duration-200"
            onClick={() => logout(navigate)}
          >
            Log Out
          </button>
        )
      ) : (
        // 🔹 Show "Log In" If User Is Logged Out
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

