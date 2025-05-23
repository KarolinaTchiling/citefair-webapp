import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SaveGuest = () => {
  const { user, login } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSaveGuest = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      console.error("No guest session found.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_BASE_URL}/guest/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade guest account");
      }

      console.log("Guest account upgraded successfully!");
      await login(email, password);
      navigate("/dashboard");

    } catch (error) {
      console.error("Error upgrading guest account:", error);
    }
  };

  return (
    <div className="px-8 md:px-20 pt-8 bg-indigo flex flex-col items-center min-h-[calc(100vh-64px)]">
        <h1 className="text-6xl md:text-5xl text-white font-semibold text-center">
          Want to Save your Results?
      </h1>
      <h1 className="text-4xl text-white text-center mt-5">
          Create an Account
      </h1>
      <div className="self-center bg-white rounded-lg p-8 w-full mt-10">
      <form onSubmit={handleSaveGuest} className="flex-grow flex flex-col">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Email:
          <input
            type="email"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-8">
          Create a Password:
          <input
            type="password"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="mt-auto w-full bg-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue/80">
          Save Account
        </button>
      </form>
      </div>
    </div>
  );
};

export default SaveGuest;


