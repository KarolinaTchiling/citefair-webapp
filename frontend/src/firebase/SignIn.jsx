import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../UserContext"; // Import the UserContext hook

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useUser(); // Get setUserId from context

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the ID token for the user
      const token = await user.getIdToken();

      // Send the token to the backend
      const response = await fetch("http://localhost:5000/api/get-user-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Failed to get user ID from backend");
      }

      const data = await response.json();
      setUserId(data.userId); // Save the userId in context
      console.log("User ID from backend:", data.userId);

      navigate("/main"); // Navigate to the main page after successful login
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError(err.message); // Set error message
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignIn;



