import React, { useRef, useState } from "react";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import s3 from "../utilities/S3";
import { useAuth } from "../context/AuthContext";
import SignupCeleb from "./signupCeleb";
import SignupUser from "./signupUser";

function SignUp() {
  const [rememberMe, setRememberMe] = useState<boolean>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const userNameRef = useRef<any>();
  const [imgKey, setImgKey] = useState<number>();
  // Initialization for ES Users
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // start
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const passwordConfirmRef = useRef<any>();
  const { signup, currentUser, uploadProfilePic }: any = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successfull, setSuccessfull] = useState<string>("");

  async function handleSubmit(
    e: any,
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    celeb: any
  ) {
    e.preventDefault();

    console.log("celeb from actual function: ", celeb);

    //if password doesn't match.
    if (password !== passwordConfirmation) {
      return setError("Passwords do not match");
      setSuccessfull("");
    }

    try {
      setError("");
      setSuccessfull("user created successfully!");

      setLoading(true);
      const userid = await signup(email, password, username);

      const imgUrl = await handleUpload(userid.uid);

      await uploadProfilePic(imgUrl, userid);

      try {
        const response = await axios.post(
          "http://localhost:3001/createCeleb",
          celeb
        );

        console.log("response: ", response);
      } catch (error) {}

      // navigate("/");
    } catch (error) {
      setSuccessfull("");
      console.log("failed to create an account", error);
    }
    setLoading(false);
    // setSuccessfull(false);
  }

  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (key: number) => {
    if (selectedFile) {
      const params = {
        Bucket: "cy-vide-stream-imgfiles", // Replace with your S3 bucket name
        Key: `profile/user(${key})`, // add user ID to the image to be able to retreive it. //change first name to profile(if it's profile) + folder. e.f profile/profile+usID+extension+timestamp
        Body: selectedFile,
        ContentType: selectedFile.type,
      };

      try {
        const data = await s3.upload(params).promise();
        console.log("Image uploaded successfully:");

        // Return the key from the successful upload

        console.log("image url: ", data);
        return data.Location;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.warn("No file selected for upload.");
    }
  };

  const userChoice = useRef<any>();
  const [selected, setSelected] = useState<string>("");
  function handleChoice(choice: string) {
    console.log("choice: ", choice);
    userChoice.current = choice;
    console.log("ref: ", userChoice.current);
  }

  return (
    <div className="">
      {/* <!-- TW Elements is free under AGPL, with commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com -->  */}
      <section className="h-screen">
        <div className="container h-full px-6 py-24 ">
          <div className="g-6 flex h-full flex-wrap sm:items-center items-start justify-center lg:justify-between ">
            {/* <!-- Left column container with background--> */}
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12 hidden sm:block">
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="Phone image"
              />
            </div>

            {/* <!-- Right column container with form --> */}
            <div className="md:w-8/12 lg:ml-6 lg:w-5/12 w-[90%] relative">
              <h1 className="text-[30px]  mb-10">Sign Up</h1>
              {error ? (
                <p className="bg-red-200 border text-black border-red-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  {error}
                </p>
              ) : successfull ? (
                <p className="bg-green-200 border text-lg text-black border-green-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  {successfull}
                </p>
              ) : null}

              <div className="flex justify-center gap-5 mb-3">
                <button
                  onClick={(e) => {
                    setSelected("celeb");
                    handleChoice("celeb");
                  }}
                  className={` p-5 w-32 ${
                    selected == "celeb"
                      ? "bg-blue-600 bg-border-4  border-white"
                      : "bg-blue-500"
                  }`}
                >
                  Celeb
                </button>
                <button
                  onClick={(e) => {
                    setSelected("fan");
                    handleChoice("fan");
                  }}
                  className={` p-5 w-32 ${
                    selected == "fan"
                      ? "bg-blue-600 bg-border-4  border-white"
                      : "bg-blue-500"
                  }`}
                >
                  Fan
                </button>
              </div>
              <div className="">
                {selected == "celeb" ? (
                  <SignupCeleb
                    handleSubmit={handleSubmit}
                    handleFileChange={handleFileChange}
                  />
                ) : (
                  <SignupUser
                    handleSubmit={handleSubmit}
                    handleFileChange={handleFileChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
