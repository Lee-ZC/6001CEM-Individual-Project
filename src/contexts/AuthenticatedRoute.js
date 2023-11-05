import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"; // Import your Firebase auth module
import { Navigate } from "react-router-dom";

const FirebaseAuthContext = createContext();

export const useAuth = () => {
  return useContext(FirebaseAuthContext);
};

export const FirebaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const signOut = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    // You can show a loading indicator here while checking the authentication state
    return null;
  }

  return (
    <FirebaseAuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const AuthenticatedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
