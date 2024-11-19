import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "./UserContext"; // Import the UserContext hook

function SignOut() {
  const { setUserId } = useUser(); // Get setUserId from context
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase Auth
      setUserId(null); // Clear the userId from context
      console.log("User signed out successfully.");
      navigate("/"); // Redirect to the login or home page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default SignOut;
