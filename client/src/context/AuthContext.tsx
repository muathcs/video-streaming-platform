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
  sendEmailVerification,
} from "firebase/auth";

import axios from "../api/axios";
import { RequestContext } from "./RequestContext";
import { User as FirebaseUser } from "firebase/auth";
import { apiUrl } from "../utilities/fetchPath";
import { AuthContextType, UserInfoType } from "../TsTypes/types";

const AuthContext = React.createContext<AuthContextType | any>("");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser>();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfoType>();

  const [celeb, setCeleb] = useState<
    { isCeleb: boolean | undefined } | undefined
  >();

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
      try {
        await reauthenticateWithCredential(user, credential);
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
      console.log("email: ", email);
      const response = await sendPasswordResetEmail(auth, email);
      console.log("res: ", response);
    } catch (error: any) {
      console.error("resetpassword: ", error.message);
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
            const response: { data: { isCeleb: boolean } } = await axios.get(
              `${apiUrl}/user/status`,
              {
                params: { uid: user.uid },
              }
            );

            let req;

            let fullUserInfo;

            if (response.data.isCeleb) {
              req = await axios.get(`${apiUrl}/request/dashboard`, {
                params: { data: user.uid },
              });

              fullUserInfo = await axios.get(`${apiUrl}/celebs/${user.uid}`);
            } else {
              req = await axios.get(`${apiUrl}/request/fanrequests`, {
                params: { data: user.uid },
              });

              // const userInfo = await axios.get(`${apiUrl}/fan`, {
              //   params: { uid: user.uid },
              // });

              fullUserInfo = await axios.get(`${apiUrl}/fan/${user.uid}`);
            }

            setRequests(req.data);
            setCeleb(response.data);
            setUserInfo(fullUserInfo.data);
            console.log("fullUser: ", fullUserInfo.data);
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

  const value: AuthContextType = {
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
