import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

const handleSignUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve the ID token for the user
    const token = await user.getIdToken(); // Retrieve the token
    console.log("User signed up", user);
    console.log("ID Token:", token);

    // Save user data to Firebase Realtime Database
    const db = getDatabase();
    await set(ref(db, `users/${user.uid}`), {
      email: user.email,
      createdAt: new Date().toISOString(), // Add timestamp for user creation
    });

    console.log("User signed up:", user);
    setError("");
    
    navigate("/main");

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

    setSuccess("Account created successfully!");
    setError("");
    navigate("/main");
  } catch (err) {
    console.error("Error:", err.message);
    setError(err.message);
    setSuccess("");
  }
};
  

  return (
    <div>
      <h2>Sign Up</h2>
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
      <button onClick={handleSignUp}>Sign Up</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "white" }}>{success}</p>}
    </div>
  );
}

export default SignUp;
