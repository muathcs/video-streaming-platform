import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupCeleb({
  handleSubmit,
  handleFileChange,
}: {
  handleSubmit: any;
  handleFileChange: any;
}) {
  const [rememberMe, setRememberMe] = useState<boolean>();
  const userNameRef = useRef<any>();

  // start
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const passwordConfirmRef = useRef<any>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successfull, setSuccessfull] = useState<string>("");

  const [mostPopularSocialMedia, setMostPopularSocialMedia] =
    useState<string>();

  const inputStyle =
    "peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200  ";
  const [celeb, setCeleb] = useState({});

  async function createACeleb(e: any) {
    const { name, value, innerText } = e.target;

    setCeleb({
      ...celeb,
      [name !== undefined ? name : "remote"]:
        value !== undefined ? value.toLowerCase() : innerText,
    });
  }

  return (
    <div>
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            userNameRef.current.value,
            emailRef.current.value,
            passwordRef.current.value,
            passwordConfirmRef.current.value,
            celeb
          )
        }
      >
        {/* <!-- display Name --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            type="text"
            name="displayName"
            className={inputStyle}
            placeholder="display Name"
            onChange={(e) => createACeleb(e)}
          />
        </div>
        {/* <!-- username input --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            name="username"
            type="text"
            ref={userNameRef}
            className={inputStyle}
            placeholder="username"
            onChange={(e) => createACeleb(e)}
          />
        </div>
        {/* <!-- Password input --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            type="password"
            ref={passwordRef}
            className={inputStyle}
            placeholder="Password"
          />
        </div>
        {/* <!-- confirm password --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            type="password"
            ref={passwordConfirmRef}
            className={inputStyle}
            placeholder="Password confirmation"
          />
        </div>

        {/* <!-- Popular app input --> */}
        <p className="text-left mb-2">
          Which App do you have the most followers on?{" "}
        </p>
        <div
          className="relative mb-6 flex gap-3  sm:flex-row flex-wrap"
          data-te-input-wrapper-init
        >
          <button
            type="button"
            onClick={(e) => setMostPopularSocialMedia("tiktok")}
            className="w-28 border-2 border-white"
            style={{
              background: mostPopularSocialMedia == "tiktok" ? "grey" : "",
            }}
          >
            TikTok
          </button>

          <button
            type="button"
            onClick={(e) => setMostPopularSocialMedia("twitter")}
            className="w-28 border-2 border-white "
            style={{
              background: mostPopularSocialMedia == "twitter" ? "grey" : "",
            }}
          >
            Twitter
          </button>
          <button
            type="button"
            onClick={(e) => setMostPopularSocialMedia("facebook")}
            className="w-28 border-2 border-white"
            style={{
              background: mostPopularSocialMedia == "facebook" ? "grey" : "",
            }}
          >
            FaceBook
          </button>
          <button
            type="button"
            onClick={(e) => setMostPopularSocialMedia("snapchat")}
            className="w-28 border-2 border-white"
            style={{
              background: mostPopularSocialMedia == "snapchat" ? "grey" : "",
            }}
          >
            SnapChat
          </button>
          <button
            type="button"
            onClick={(e) => setMostPopularSocialMedia("instagram")}
            className="w-28 border-2 border-white"
            style={{
              background: mostPopularSocialMedia == "instagram" ? "grey" : "",
            }}
          >
            Instagram
          </button>
        </div>

        {/* how many followers */}
        {mostPopularSocialMedia && (
          <div className="mb-6">
            <input
              name="follower"
              type="text"
              onChange={(e) => createACeleb(e)}
              className={inputStyle}
              placeholder={`how many followers do you have on ${mostPopularSocialMedia}`}
            />
          </div>
        )}
        {/* what is your @ */}
        {mostPopularSocialMedia && (
          <div className="mb-6">
            <input
              onChange={(e) => createACeleb(e)}
              name="account"
              type="text"
              //   onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              placeholder={`What is your @ on ${mostPopularSocialMedia}`}
            />
          </div>
        )}

        {/* category */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <label className="block text-sm font-medium mb-2 w-full sm:w-3/6 text-white text-left">
            What category do you specialise in?
          </label>
          <select
            onChange={(e) => createACeleb(e)}
            name="category"
            data-te-select-init
            className="w-full h-10 pl-2 rounded-md bg-transparent  border text-black cursor-pointer"
          >
            <option>Select</option>
            <option value="1">Holiday</option>
            <option value="2">Birthday</option>
            <option value="3">Pep Talk</option>
            <option value="4">Roast</option>
            <option value="5">Advice</option>
            <option value="6">Question</option>
            <option value="7">Other</option>
          </select>
        </div>

        {/* price */}
        <div className="mb-6">
          <input
            name="price"
            onChange={(e) => createACeleb(e)}
            type="text"
            className={inputStyle}
            placeholder="$0.00"
          />
        </div>
        {/* email  */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            name="email"
            onChange={(e) => createACeleb(e)}
            type="text"
            ref={emailRef}
            className={inputStyle}
            placeholder="email address"
          />
        </div>

        {/* Message*/}

        <div className="">
          <div className="text-left">
            Give a brief Description of yourself(this will go on your website)
          </div>
          <textarea
            name="description"
            onChange={(e) => createACeleb(e)}
            className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                     px-2 py-2  h-40 shadow-sm shadow-blue-400   outline-none placeholder-style  relative
                      "
            placeholder="I'm a huge fan of your incredible work. I have a special occasion coming up, and I was wondering if you could send a personalized shout-out or a few words of encouragement to make it even more memorable."
          />
        </div>

        {/* <!-- Image --> */}
        <div
          className="relative mb-2  h-[50px] border"
          data-te-input-wrapper-init
        >
          <input
            type="file"
            onChange={handleFileChange}
            className={
              inputStyle + " border-none right-0 w-[50%] h-[50px] absolute"
            }
          />

          <label
            htmlFor="exampleFormControlInput33"
            className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
          >
            Pick a Profile image
          </label>
        </div>

        {/* <!-- Remember me checkbox --> */}
        <div className="mb-5 flex items-center justify-between ">
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
            have an account already? Login instead
          </Link>
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
  );
}

export default SignupCeleb;
