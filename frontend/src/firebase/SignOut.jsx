import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";

function SignOut() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}

export default SignOut;