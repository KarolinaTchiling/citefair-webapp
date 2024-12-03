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
  };

  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const continueAsGuest = async () => {
    await signInAnonymously(auth);
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