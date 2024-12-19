import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const SignupForm = () => {
  const { user, signup } = useAuth();
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

      /// Step 1: Create a new user with Firebase Authentication
      const userCredential = await signup(email, password);
      const user = userCredential.user;  // required to use the return since context and firebase are not updated right away
      console.log("User signed up:", userCredential);

      // Step 2: Save user data to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        email: email,
        firstName: firstName,
        lastName: lastName,
        field: field,
        createdAt: new Date().toISOString(), // Add timestamp for user creation
      });
      console.log("User data saved to database.");

      // Step 4: Navigate to the main page
      setSuccess("Account created successfully!");
      setError("");
      navigate("/dashboard");

    } catch (error) {
      console.error("Signup failed:", error.message);
    }
  };

  return (
    <div className="flex items-center w-full justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="field"
              className="block text-sm font-medium text-gray-700"
            >
              Field
            </label>
            <select
              id="field"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select your field
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

