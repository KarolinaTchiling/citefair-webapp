import { getAuth } from "firebase/auth";

export async function getCurrentUserToken() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently logged in");
    }

    // Get the Firebase ID token
    const token = await user.getIdToken();
    console.log("Firebase Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting Firebase token:", error);
  }
}