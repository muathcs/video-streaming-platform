import React, { useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import axios from "../api/axios";
import { RequestContext } from "./RequestContext";
import { User as FirebaseUser } from "firebase/auth";
import { apiUrl } from "../utilities/fetchPath";
import { ErrorCause } from "aws-sdk/clients/qldb";

const AuthContext = React.createContext("");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser>();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>();

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
    // signInWithCustomToken;
  }

  function logout() {
    try {
      return auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  async function reauthenticateUser(password: string) {
    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      console.log("bewlo creds: ", user.email);
      try {
        await reauthenticateWithCredential(user, credential);
        console.log("User reauthenticated successfully.");
        return {
          state: true,
          message: "User credentials updated successfully",
        };
      } catch (error: any) {
        console.error("Error reauthenticating user:", error.message);
        return { state: false, message: error.message };
        // throw error;
      }
    } else {
      console.error("No user is currently signed in.");
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
    console.log("useEffectXX");
    const unsubscribe = auth.onAuthStateChanged(
      async (
        user: any //this works
      ) => {
        console.log("user auth: ", auth.currentUser);
        setCurrentUser(user);

        console.log("userXXX: ", user);

        if (user) {
          try {
            const response = await axios.get(`${apiUrl}/status`, {
              params: { uid: user.uid },
            });

            let req;

            let fullUserInfo;

            if (response.data) {
              console.log("dashboard");
              req = await axios.get(`${apiUrl}/dashboard`, {
                params: { data: user.uid },
              });

              fullUserInfo = await axios.get(`${apiUrl}/celeb/${user.uid}`);
              console.log("myFULL: ", fullUserInfo);
            } else {
              console.log("here");
              req = await axios.get(`${apiUrl}/fanrequests`, {
                params: { data: user.uid },
              });

              // const userInfo = await axios.get(`${apiUrl}/fan`, {
              //   params: { uid: user.uid },
              // });

              fullUserInfo = await axios.get(`${apiUrl}/fan/${user.uid}`);
              console.log("fullAuth: ", fullUserInfo.data);
            }

            setRequests(req.data);
            setCeleb(response.data);
            setUserInfo(fullUserInfo.data);
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
    reauthenticateUser,
    uploadProfilePic,
    celeb,
    userInfo,
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
