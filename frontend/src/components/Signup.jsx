import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Signup = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [field, setField] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create a new user with Firebase Authentication
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // Step 2: Save user data to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        email,
        firstName,
        lastName,
        field,
        createdAt: new Date().toISOString(),
      });

      // Step 3: Navigate to the dashboard
      setSuccess("Account created successfully!");
      setError("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg p-8">

      {/* Error & Success Messages */}
      {error && <div className="text-red-500 text-center mb-2">{error}</div>}
      {success && <div className="text-green-500 text-center mb-2">{success}</div>}

      {/* Form Section */}
      <form onSubmit={handleSignup} className="flex-grow flex flex-col">
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Field Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Field of Study</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select your field</option>
            <option value="Engineering">Engineering</option>
            <option value="Science">Science</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button (Pushes to Bottom) */}
        <button
          type="submit"
          className="mt-auto w-full bg-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue/80"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;


