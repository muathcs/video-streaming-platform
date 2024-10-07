import { useRef, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../utilities/fetchPath";

function Login() {
  const [rememberMe, setRememberMe] = useState<boolean>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const emailRef = useRef<any>();
  const passwordRef = useRef<any>();
  const { login, resetPassword }: any = useAuth();
  const [loading, setLoading] = useState(false);
  const [successfull, setSuccessfull] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string>("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //login function
    async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const userObj = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      
      await isACeleb(userObj.user.uid); //checking if the user is a celeb or a fan(to render different UIs);
      setSuccessfull("signed in successfully");

    } catch (error) {
      setSuccessfull("");
      setError("Wrong email or password");
      console.error("failed to sign in", error);
    } finally {
      setLoading(false);
    }
  }
  

  async function isACeleb(uid: number) {
    try {
      ("before axios");
      const response = await axios.get(`${apiUrl}/user/status`, {
        params: { uid: uid },
      });

      localStorage.setItem("celeb", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  // reset password
  function handleResetPassword() {
    try {
      setResetMessage("");
      resetPassword(emailRef.current.value);
      setResetMessage("We sent you a password reset email");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {/* <!-- TW Elements is free under AGPL, with commercial license required for specific uses. See more details: https://tw-elements.com/license/ and contact us for queries at tailwind@mdbootstrap.com -->  */}
      <section className="h-screen flex justify-center bg-black">
        <div className="container h-full px-6 py-24 ">
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
              <h1 data-testid="sign-in-title" className="text-[30px]  mb-10">
                Sign in
              </h1>
              {error ? (
                <p
                  data-testid="error-message"
                  className="bg-red-200 border text-black border-red-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                >
                  {error}
                </p>
              ) : successfull ? (
                <p className="bg-green-200 border text-lg text-black border-green-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  {successfull}
                </p>
              ) : resetMessage ? (
                <p className="bg-green-200 border text-lg text-black border-green-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                  {resetMessage}
                </p>
              ) : null}
              <form data-testid="on-submit-login" onSubmit={handleSubmit}>
                {/* <!-- Email input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    type="email"
                    data-testid="email-input"
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    {email.length == 0 ? "Email address" : ""}
                  </label>
                </div>

                {/* <!-- Password input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    type="password"
                    data-testid="password-input"
                    ref={passwordRef}
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

                {/* <!-- Remember me checkbox --> */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                    <input
                      className="relative  float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                      type="checkbox"
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

                  {/* <!-- Forgot password link --> */}
                  <a
                  
                    href="/reset/password"
                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* <!-- Submit button --> */}
                <button
                  disabled={email && password ? false : true}
                  role="Login-button"
                  type="submit"
                  className={`inline-block w-full bg-[#5e7dc2] disabled:opacity-60 disabled:cursor-not-allowed
                     hover:bg-[#5b82d4] cursor-pointer
                   rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white`}
                  data-te-ripple-init
                  data-te-ripple-color="light"
                >
                  Sign in
                </button>
                {/* <!-- Submit button --> */}
                <button
                  type="submit"
                  className="inline-block mt-5 w-full bg-[#4979e1] hover:bg-[#4668b1] rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={() => navigate("/register")}
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

export default Login;
