import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupUser({
  handleSubmit,
  handleFileChange,
}: {
  handleSubmit: any;
  handleFileChange: any;
}) {
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
  return (
    <>
      <div>
        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              userNameRef.current.value,
              emailRef.current.value,
              passwordRef.current.value,
              passwordConfirmRef.current.value
            )
          }
        >
          {/* <!-- username input --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="text"
              ref={userNameRef}
              onChange={(e) => setUserName(e.target.value)}
              className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 
                     ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100
                      motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 
                      [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
            />
            <label
              htmlFor="exampleFormControlInput3"
              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
            >
              {username.length == 0 ? "username" : ""}
            </label>
          </div>
          {/* email  */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="text"
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 
                     ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100
                      motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 
                      [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
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
              ref={passwordRef}
              onChange={(e) => setPassWord(e.target.value)}
              className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              placeholder="Password"
            />
            <label
              htmlFor="exampleFormControlInput33"
              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
            >
              {password.length == 0 ? "Password" : ""}
            </label>
          </div>
          {/* <!-- confirm password --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="password"
              ref={passwordConfirmRef}
              onChange={(e) => setPassWord(e.target.value)}
              className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              placeholder="Password"
            />
            <label
              htmlFor="exampleFormControlInput33"
              className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
            >
              {password.length == 0 ? "confirm password" : ""}
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
          <div className="mb-0 flex items-center justify-between ">
            <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
              <input
                className="relative  float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                type="checkbox"
                value=""
                id="exampleCheck3"
                onClick={() => setRememberMe(!rememberMe)}
                checked={rememberMe}
              />
              <label
                className="inline-block  pl-[0.15rem] hover:cursor-pointer"
                htmlFor="exampleCheck3"
              >
                Remember me
              </label>
            </div>

            <Link
              to="/login"
              className="underline text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
            >
              Login instead
            </Link>
          </div>

          <div className="flex justify-end mb-6">
            {/* <!-- loginlink --> */}
            <a
              href="#!"
              className=" underline  text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
            >
              Forgot password?
            </a>
          </div>

          {/* <!-- Submit button --> */}
          <button
            disabled={loading}
            type="submit"
            className="inline-block w-full bg-[#5e7dc2] mb-5 rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignupUser;
