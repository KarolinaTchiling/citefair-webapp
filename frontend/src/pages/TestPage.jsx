import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const LoginPage = () => {
  const { user, login, signup, logout, continueAsGuest } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup modes

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await signup(email, password);
        console.log("User signed up!");
      } else {
        await login(email, password);
        console.log("User logged in!");
      }
    } catch (error) {
      console.error(`${isSignup ? "Signup" : "Login"} failed:`, error.message);
    }
  };

  const handleGuest = async () => {
    try {
      await continueAsGuest();
      console.log("Logged in as guest!");
    } catch (error) {
      console.error("Guest login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out!");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  console.log(user)
  return (
    <div className="auth-container">
      {user ? (
        <>
          <h1>{user.isAnonymous ? "Welcome, Guest!" : `Welcome, ${user.email}!`}</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>{isSignup ? "Sign Up" : "Log In"}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // Prevent form refresh
              handleAuth();
            }}
          >
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
          </form>
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
          </button>
          <button onClick={handleGuest}>Continue as Guest</button>
        </>
      )}
    </div>
  );
};

export default LoginPage;
