import React, { useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const AuthContext = React.createContext("");

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(email: any, password: any): Promise<string> {
    try {
      // Wait for createUserWithEmailAndPassword to complete
      const userCredential: any = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Obtain the user's UID
      const uid: string = userCredential.user.uid;

      // Now, you can return the user's UID
      return uid;
    } catch (error: any) {
      // Handle any errors that might occur during the signup process
      console.error("Signup error:", error.message);
      throw error; // Rethrow the error to let the caller handle it
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: any = {
    currentUser,
    signup,
  };
  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
      ;
    </>
  );
}
