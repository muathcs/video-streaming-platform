import React, { useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const AuthContext = React.createContext("");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  async function signup(
    email: any,
    password: any,
    username: string
  ): Promise<string> {
    try {
      // Wait for createUserWithEmailAndPassword to complete
      const userCredential: any = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("signup function: ", userCredential);

      // After creating the user, get the user object
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
        photoURL: "http://localhost:3001:test/test/photo",
      });

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

  function login(email: any, password: any) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    try {
      return auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  //reset password
  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);

      if (user) {
        user.getIdToken().then((token: any) => {
          // 'token' contains the session token
          setToken(token);
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: any = {
    currentUser,
    resetPassword,
    token,
    signup,
    login,
    logout,
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
