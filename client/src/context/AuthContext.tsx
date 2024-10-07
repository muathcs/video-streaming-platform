import React, { useContext, useEffect, useState } from "react";
import { auth } from "../auth/firebase";
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import axios from "../api/axios";
import { RequestContext } from "./RequestContext";
import { User as FirebaseUser } from "firebase/auth";
import { apiUrl } from "../utilities/fetchPath";
import { AuthContextType, UserInfoType } from "../TsTypes/types";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext<AuthContextType | any>("");

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser>();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const navigate = useNavigate();


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
      async (user: any, ) => {
        setCurrentUser(user);
        
        if (user) {
          try {
            setLoading(true);
            const statusResponse = await axios.get(`${apiUrl}/user/status`, { params: { uid: user.uid } });
            const isCeleb = statusResponse.data.isCeleb;
            
            const [req, fullUserInfo] = await Promise.all([
              axios.get(`${apiUrl}/request/${isCeleb ? 'dashboard' : 'fanrequests'}`, { params: { data: user.uid } }),
              axios.get(`${apiUrl}/${isCeleb ? 'celebs' : 'fan'}/${user.uid}`)
            ]);

            setRequests(req.data);
            setCeleb(statusResponse.data);
            setUserInfo(fullUserInfo.data);

            const token = await user.getIdToken();
            setToken(token);


          } catch (error) {
            console.error(error);
          }
        } else {
          // User is logged out
          setRequests(undefined);
          setCeleb(undefined);
          setUserInfo(undefined);
          setToken('');
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
