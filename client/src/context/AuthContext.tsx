import React, { useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import axios from "../api/axios";
import { RequestContext } from "./RequestContext";
import { User as FirebaseUser } from "firebase/auth";

const AuthContext = React.createContext("");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser>();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  const [celeb, setCeleb] = useState();

  // const [requests, setRequests] = useState();

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

      // Obtain the user's UID
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
    signInWithCustomToken;
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
    const unsubscribe = auth.onAuthStateChanged(
      async (
        user: any //this works
      ) => {
        setCurrentUser(user);
        if (user) {
          try {
            const response = await axios.get("http://localhost:3001/status", {
              params: { uid: user.uid },
            });

            let req;

            if (response.data) {
              req = await axios.get("http://localhost:3001/dashboard", {
                params: { data: user.uid },
              });

              console.log("inside: ", req.data);
            } else {
              req = await axios.get("http://localhost:3001/fanrequests", {
                params: { data: user.uid },
              });
            }

            setRequests(req.data);
            setCeleb(response.data);
          } catch (error) {
            console.error(error);
          }
          user.getIdToken().then((token: any) => {
            // 'token' contains the session token
            setToken(token);
          });
        }

        setLoading(false);
      }
    );

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
    celeb,
  };

  // this is for the Request Context
  const [requests, setRequests] = useState();

  const requestValues: any = {
    requests,
    setRequests,
    name: "muath",
  };
  return (
    <>
      <RequestContext.Provider value={requestValues}>
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      </RequestContext.Provider>
    </>
  );
}
