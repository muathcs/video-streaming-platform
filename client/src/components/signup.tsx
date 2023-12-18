import React, { useState } from "react";
import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import s3 from "../utilities/S3";
// const s3 = new AWS.S3({
//   region: "eu-west-2", // Replace with your AWS region
//   accessKeyId: "AKIAQ24MTJ6NCLEQSH4W",
//   secretAccessKey: "M0H2EtwKmVFdX209kqEk1GHczAoSLe5K3Rg5Qs4N",
// });

function SignUp() {
  const [rememberMe, setRememberMe] = useState<boolean>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [imgKey, setImgKey] = useState<number>();
  // Initialization for ES Users
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // this functions sends the user inputted email and password, and sends them to the server,
  // if a user exists with those inputs, then a success object is returned, if object is true,
  // redux state is true, and user is allowed into the app. If not user stays out.
  async function SignUp(e: any) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username: username,
        email: email,
        password: password,
      });

      if (response.data) {
        handleUpload(response.data.userid);
        console.log("Registration successful");
        navigate("/");
      } else {
        console.log("Registration failed");
        // Handle registration failure
      }
    } catch (error: any) {
      console.log(error.message);
      // Handle error
    }
  }

  // upload image to aws

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
        return data.Key;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.warn("No file selected for upload.");
    }
  };

  return (
    <div>
      {/* <!-- TW Elements is free under AGPL, with commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com -->  */}
      <section className="h-screen">
        <div className="container h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            {/* <!-- Left column container with background--> */}
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <img
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="w-full"
                alt="Phone image"
              />
            </div>

            {/* <!-- Right column container with form --> */}
            <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
              <form>
                {/* <!-- Email input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 
                     ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100
                      motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 
                      [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlInput3"
                  />
                  <label
                    htmlFor="exampleFormControlInput3"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    {username.length == 0 ? "username" : ""}
                  </label>
                </div>
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 
                     ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100
                      motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 
                      [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlInput3"
                    placeholder={email.length > 0 ? "Emailxx addressx" : ""}
                  />
                  <label
                    htmlFor="exampleFormControlInput3"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    {email.length == 0 ? "Email address" : ""}
                  </label>
                </div>

                {/* <!-- Password input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassWord(e.target.value)}
                    className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                    id="exampleFormControlInput33"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="exampleFormControlInput33"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    {password.length == 0 ? "Password" : ""}
                  </label>
                </div>
                {/* <!-- Image --> */}
                <div
                  className="relative mb-6  h-[50px] border"
                  data-te-input-wrapper-init
                >
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className=" block min-h-[auto] w-2/4 rounded 
                     bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none 
                     transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                     data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none
                     hover:cursor-pointer
                      dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0
                        right-0 h-[50px] absolute
                      "
                    id="exampleFormControlInput33"
                    placeholder="Password"
                  />

                  <label
                    htmlFor="exampleFormControlInput33"
                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                  >
                    Pick a Profile image
                  </label>
                </div>

                {/* <!-- Remember me checkbox --> */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                    <input
                      className="relative  float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                      type="checkbox"
                      value=""
                      id="exampleCheck3"
                      onClick={(e) => setRememberMe(!rememberMe)}
                      checked={rememberMe}
                    />
                    <label
                      className="inline-block  pl-[0.15rem] hover:cursor-pointer"
                      htmlFor="exampleCheck3"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* <!-- Forgot password link --> */}
                  <a
                    href="#!"
                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* <!-- Submit button --> */}
                <button
                  type="submit"
                  className="inline-block w-full bg-[#5e7dc2] rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={(e) => SignUp(e)}
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
