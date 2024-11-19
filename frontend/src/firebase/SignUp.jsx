import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { useUser } from "../UserContext"; // Import the UserContext hook

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setUserId } = useUser(); // Get setUserId from context

  const handleSignUp = async () => {
    try {
      // Step 1: Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Retrieve the ID token for the user
      const token = await user.getIdToken();
      console.log("User signed up:", user);
      console.log("ID Token:", token);

      // Step 3: Save user data to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        createdAt: new Date().toISOString(), // Add timestamp for user creation
      });

      console.log("User data saved to database.");

      // Step 4: Send the token to the backend
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

      // Step 5: Set userId in UserContext
      setUserId(data.userId);

      // Step 6: Navigate to the main page
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
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default SignUp;
