import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleSignUp from '/google_signup.svg';

const Signup = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, firstName, lastName, navigate);
    } catch (error) {
    }
  };

  const { signInWithGoogle } = useAuth();

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

        {/* Submit Button (Pushes to Bottom) */}
        <button
          type="submit"
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


