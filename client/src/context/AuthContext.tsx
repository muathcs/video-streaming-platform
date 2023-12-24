import React, { useContext, useEffect, useMemo, useState } from "react";
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

  const [celeb, setCeleb] = useState(false);

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

      // Obtain the user's UID
      const uid: string = userCredential.user.uid;
      const user: any = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      //return user, will use this for profile pic upload function below
      return userCredential.user;
    } catch (error: any) {
      // Handle any errors that might occur during the signup process
      console.error("Signup error:", error.message);
      throw error; // Rethrow the error to let the caller handle it
    }
  }

  async function uploadProfilePic(imgurl: string, user: any) {
    await updateProfile(user, {
      photoURL: imgurl,
    });
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
    uploadProfilePic,
  };
  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
}
