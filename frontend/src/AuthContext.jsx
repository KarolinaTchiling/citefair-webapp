import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig"; // Import your configured auth
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "firebase/auth";

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    sessionStorage.clear();
  };

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const registerGuest = async (uid, firstName, middleName, lastName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/guest/registerGuest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, firstName, middleName, lastName }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error registering guest:", error);
    }
  };

  const continueAsGuest = async (firstName, middleName, lastName) => {
    try {
      const result = await signInAnonymously(auth);
      const guestUID = result.user.uid;
      await registerGuest(guestUID, firstName, middleName, lastName);
    } catch (error) {
      console.error("Error during guest sign-in:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    continueAsGuest,
    isAuthenticated: !!user // True only if logged in and not a guest
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};