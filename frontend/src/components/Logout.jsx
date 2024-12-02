import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GuestLogin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout= async (e) => {
    e.preventDefault();
    try {
      await continueAsGuest();
      console.log("User logged out!");
      navigate("/");
    } catch (error) {
      console.error("Log failed:", error.message);
    }
  };

  return (
    <div>
        <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default GuestLogin;