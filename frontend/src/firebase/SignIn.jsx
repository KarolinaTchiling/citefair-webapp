import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Handle error messages
  const navigate = useNavigate(); // Initialize navigate function

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the ID token for the user
      const token = await user.getIdToken();
      console.log("logged in:", user);
      console.log("ID Token:", token);

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
      console.log("User ID from backend:", data.userId);

      // Navigate to the main page after successful login
      console.log("Navigating to /main");
      navigate("/main");
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError(err.message); // Set error message to display to the user
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


