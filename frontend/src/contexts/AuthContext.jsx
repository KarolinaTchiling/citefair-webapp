import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { auth } from "../firebaseConfig"; 
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const provider = new GoogleAuthProvider();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          // console.log(token); // for debugging

          // store the user's name in the context so easy access on other pages
          const response = await fetch(`${API_BASE_URL}/user/name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFullName({
              first: data.firstName || "",
              middle: data.middleName || "",
              last: data.lastName || ""
            });
          } else {
            console.warn("Failed to fetch user name.");
          }
        } catch (err) {
          console.error("Error fetching user name:", err);
        }
      } else {
        setFullName(null); // logout
      }
    });

    return () => unsubscribe();
  }, []);


  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setUser(userCredential.user); 
  };

  const logout = async (navigate) => {
    try {
        await signOut(auth);
        sessionStorage.clear();
        navigate("/"); 
    } catch (error) {
        console.error("Error logging out:", error);
    }
  };

  const registerGuest = async (firstName, middleName, lastName) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/guest/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, middleName, lastName }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error registering guest:", error);
    }
  };

  const continueAsGuest = async (firstName, middleName, lastName) => {
    try {
      await signInAnonymously(auth);
      await registerGuest( firstName, middleName, lastName);
    } catch (error) {
      console.error("Error during guest sign-in:", error);
    }
  };

  const signup = async (email, password, firstName, middleName, lastName, navigate) => {
    try {
      // Step 1: Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Step 2: Save user data to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid, // Save UID as well
        email,
        firstName,
        middleName,
        lastName,
        isGuest: false,
        createdAt: new Date().toISOString(),
      });

      console.log("User successfully signed up & saved to database.");
      navigate("/dashboard"); 
  
    } catch (error) {
      console.error("Signup failed:", error);
      throw error; 
    }
  };

  const signInWithGoogle = async (navigate) => {
    try {
      const authInstance = getAuth();
      const result = await signInWithPopup(authInstance, provider);
      const user = result.user;

      // Get user data
      const { uid, email, displayName } = user;
      const nameParts = displayName ? displayName.split(" ") : [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const middleName = ""; // Google does not provide a middle name

      // Get Firebase Database reference
      const db = getDatabase();
      const userRef = ref(db, `users/${uid}`);

      // Check if user exists
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // If user does NOT exist, create them
        await set(userRef, {
          uid,
          email,
          firstName,
          middleName,
          lastName,
          isGuest: false,
          createdAt: new Date().toISOString(),
        });
        console.log("New user created in database.");
      } else {
        console.log("User already exists, logging in.");
      }
      console.log("Google Sign-In successful");
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Google Sign-In failed:", error);
    }
  };
  

  const value = {
    user,
    login,
    logout,
    signup,
    continueAsGuest,
    signInWithGoogle,
    isAuthenticated: !!user,
    fullName,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};