import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const GuestLogin = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuest= async (e) => {
    e.preventDefault();
    try {
      await continueAsGuest();
      console.log("User logged in as guest!");
      navigate("/upload");
    } catch (error) {
      console.error("Guest login failed:", error.message);
    }
  };

  return (
    <div>
        <button onClick={handleGuest}>Continue as Guest</button>
    </div>
  );
};

export default GuestLogin;
