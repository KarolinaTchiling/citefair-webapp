import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleSignUp from '/google_signup.svg';

const Signup = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, firstName, middleName, lastName, navigate);

    } catch (error) {

      console.error("Signup failed:", error.message);
      if (error.message.includes("auth/email-already-in-use")) {
        setError("That email is already registered. Please try logging in.");
      } else if (error.message.includes("auth/invalid-email")) {
        setError("The email address is not valid.");
      } else if (error.message.includes("auth/weak-password")) {
        setError("Your password must be at least 6 characters long.");
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  const { signInWithGoogle } = useAuth();

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg p-8">
      <p className="text-base text-center">
        Please use the name under which you publish in order to remove self-citation biases from our analysis.
      </p>


      {/* Form Section */}
      <form onSubmit={handleSignup} className="flex-grow flex flex-col">
        {/* First Name */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Middle Name */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Middle Name</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>        

        {/* Last Name */}
        <div className="mb-2">
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
        <div className="mb-2">
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

        {error && (
        <div className="text-red pb-3">
          {error}
        </div>
        )}

        <button
          className="mt-auto w-full bg-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue/80"
        >
          Sign Up
        </button>

      </form>

      <div className="flex flex-row items-center text-lg mt-5 gap-10 self-center">
          <p>Or</p>

          <button onClick={() => signInWithGoogle(navigate)} className="group">
            <img src={GoogleSignUp} className="h-12 transition duration-200 group-hover:brightness-75" />
          </button>

        </div>
    </div>
  );
};

export default Signup;


