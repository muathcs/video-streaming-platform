import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContextType, SocialMediaType } from "../TsTypes/types.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import axios from "axios";
import { apiUrl } from "@/utilities/fetchPath.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

import { IoClose } from "react-icons/io5";
import SuccessConfetti from "../assets/successPNG.png";
import { cn } from "@/lib/utils.ts";
const firebaseErrorMessages: { [key: string]: string } = {
  "Firebase: Error (auth/email-already-in-use).":
    "Email is already in use. Please use a different email.",

  // Add more error codes and custom messages as needed
};

function SuccessPage() {
  return (
    <div className="max-w-7xl h-full flex flex-col justify-center items-center text-center p-6">
      <img
        src={SuccessConfetti}
        alt="Success Confetti"
        className="object-contain mb-6"
        width={200}
      />
      <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
      <p className="text-xl mb-4">Your account has been successfully set up.</p>
      <p className="text-lg">
        To complete the onboarding process and start receiving fan requests,
        download the Hikaya app from the Google Play Store or the Apple App
        Store, and log in using your credentials.
      </p>
      <div className="flex space-x-4 mt-6">
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 hover:text-white transition"
        >
          Google Play Store
        </a>
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 hover:text-white transition"
        >
          Apple App Store
        </a>
      </div>
    </div>
  );
}

function SignupCeleb() {
  const { signup, currentUser }: AuthContextType = useAuth();

  console.log("current: ", currentUser);

  const [rememberMe, setRememberMe] = useState<boolean>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const [mostPopularSocialMedia, setMostPopularSocialMedia] =
    useState<string>();

  const socialMedias: SocialMediaType[] = [
    { name: "tiktok" },
    { name: "twitter" },
    { name: "instagram" },
    { name: "facebook" },
    { name: "snapchat" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    getValues,
  } = useForm();

  console.log("here: ", getValues());

  // async function onsubmit(data: FieldValues) {
  //   console.log("herex");
  //   console.log("successMessagE: ");
  //   console.log("here");
  //   await createUser(data, true);
  //   // setSuccessMessage(true);
  //   // reset(); // true indiciates this is a celeb being created.
  // }

  async function onSubmit(data: FieldValues) {
    console.log("onSubmit");
    try {
      // const { displayName, email } = data;

      // const userid = await signup(email, password, displayName);
      // sendEmailVerification(email);

      const email = getValues().email;
      const password = getValues().password;
      const confirmPassword = getValues().confirmPassword;

      if (password != confirmPassword) {
        return setError("Passwords do not match");
      }

      console.log("email: ", getValues().email);
      console.log("name: ", getValues().password);
      console.log("name: ", getValues().confirmPassword);
      console.log("display: ", getValues().displayName);
      const userCredential = await signup(
        email,
        password,
        getValues().displayName
      );

      if(!userCredential){
        console.log("error in user cred")
      }
      console.log("user: ", userCredential);
      // const verfiy = await sendEmailVerification(userCredential);

      // const user = auth.getUser("QBZRHzOOBjXwjcqLaZeQyrzDTe23");

      const updateData = {
        ...data,
        uid: userCredential.uid,
      };

      const respones = await axios.post(
        `${apiUrl}/celebs/createCelebPartial`,
        updateData
      );

      console.log("response: ", respones);
      setSuccess(true);
      reset();
    } catch (error: any) {
      const errorMessage = firebaseErrorMessages[error.message];
      console.error("onSubmitCeleb", errorMessage);
      setError(errorMessage);
    }
  }

  const inputStyle =
    "block min-h-[auto] w-full  rounded-lg border border-[#3f3b45] bg-transparent px-3 py-2 leading-[2.15] outline-none  ";

  return (
    <div className="bg-black ">
      <div className=" max-w-2xl mx-auto px-4 flex justify-center items-center flex-col  ">
   
        {success ? (
          <SuccessPage />
        ) : (
          <>
 
            <div className="pt-20 mb-10">
              <h1 className="text-5xl font-serif relative ">
                Share Your <span className="text-purple-500">Hikaya</span>{" "}
                <br />
                and Get Rewarded
              </h1>
              <h2 className="text-gray-300 text-3xl mt-10 mb-5 font-serif">
                Connect with your audience. <br />
                Start earning from your passion today.
              </h2>
            </div>
            {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-10 py-5 max-w-lg  rounded relative mb-5 "
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <span
              onClick={() => {
                setError("");
              }}
              className="absolute right-2 text-2xl hover:cursor-pointer"
            >
              <IoClose />
            </span>
          </div>
        )}

            <form className="max-w-lg " onSubmit={handleSubmit(onSubmit)}>
              
              {" "}
              {/* <!-- display Name --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="text"
                  className={cn(inputStyle, "bg-[#201e23]") }
                  placeholder="display Name"
                  {...register("displayName", {
                    required: "display name is required",
                  })}
                />
                {errors.displayName && (
                  <p className=" mt-2 text-red-400">{`${errors.displayName.message}`}</p>
                )}
              </div>
              {/* <!-- username input --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="text"
                  className={cn(inputStyle, "bg-[#201e23]") }
                  placeholder="Legal Name"
                  {...register("username", {
                    required: "username is required",
                  })}
                />
                {errors.username && (
                  <p className=" mt-2 text-red-400">{`${errors.username.message}`}</p>
                )}
              </div>
              {/* <!-- Popular app input --> */}
              <p className="text-left mb-2">
                Which App do you have the most followers on?{" "}
              </p>
              <div
                className="relative mb-6 flex gap-3  sm:flex-row flex-wrap "
                data-te-input-wrapper-init
              >
                {socialMedias.map((app) => (
                  <button
                    {...register("MostPopularApp", {
                      required: "pick a social media app",
                    })}
                    type="button"
                    onClick={() => {
                      console.log("cripsy");
                      console.log("hereAPP: ", app.name);
                      setValue("MostPopularApp", app.name);
                      setMostPopularSocialMedia(app.name);
                    }}
                    className="w-28 border border-[#3f3b45] py-4 bg-[#201e23] rounded-lg"
                    style={{
                      background:
                        mostPopularSocialMedia == app.name ? "#5a5a5c" : "",
                    }}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
              {/* {errors.app && (
          <p className=" mt-2 text-red-400">{`${errors.app.message}`}</p>
        )} */}
              {/* how many followers */}
              {mostPopularSocialMedia && (
                <div className="mb-6">
                  <input
                    {...register("followers", {
                      required: "Followers field is required",
                      validate: (value) => {
                        const parsedValue = parseInt(value, 10);

                        if (isNaN(parsedValue)) {
                          return "Please enter a valid number for followers";
                        }

                        // Additional validation logic if needed

                        return true; // Validation passed
                      },
                    })}
                    type="text" // Keep the type as text
                    className={cn(inputStyle, "bg-[#201e23]") }
                    placeholder={`How many followers do you have on ${mostPopularSocialMedia}`}
                  />
                  {errors.followers && (
                    <p className=" mt-2 text-red-400">{`${errors.followers.message}`}</p>
                  )}
                </div>
              )}
              {/* what is your @ */}
              {mostPopularSocialMedia && (
                <div className="mb-6">
                  <input
                    type="text"
                    {...register("account", {
                      required: "input your social media handle?",
                    })}
                    //   onChange={(e) => setEmail(e.target.value)}
                    className={cn(inputStyle, "bg-[#201e23]") }
                    placeholder={`What is your @ on ${mostPopularSocialMedia}`}
                  />
                  {errors.account && (
                    <p className=" mt-2 text-red-400">{`${errors.account.message}`}</p>
                  )}
                </div>
              )}
              {/* category */}
              {/* <div className="relative mb-6 " data-te-input-wrapper-init>
                <label className="block text-sm font-medium mb-2 w-full sm:w-4/6 text-white text-left ">
                  What is your largest following
                </label> */}
                {/* <select
            {...register("category", {
              required:
                "pick a category, choose other if nothing applies to you.",
            })}
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
          </select> */}
                {/* <div className="z-20">
                  <Select
                  
                    name="category"
                    onValueChange={(e) => {
                      console.log("E: ", e);
                      setValue("category", e);
                    }}
                  >
                    <SelectTrigger
                    className=" border border-[#3f3b45] w-full z-10 py-6 bg-[#201e23] focus:border-none outline-none "
                    
                    >
                      <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                    <SelectContent className="z-10">
                      <SelectGroup
                        {...register("category", {
                          required:
                            "Select a range for how many followers you have.",
                        })}
                        className="z-20 cursor-pointer bg-slate-800 "
                      >
                        <SelectLabel>Followers count</SelectLabel>
                        <SelectItem className="cursor-pointer" value="<10K">
                          {"<10K"}
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="10K-50k">
                          {"10K-50k"}
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="50K-100k">
                          {"50K-100k"}
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          value="100K-300k"
                        >
                          {"100K-300k"}
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="300K-1m">
                          {"300K-1m"}
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="1m-3m">
                          {"1m-3m"}
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="3m+">
                          {"3m+"}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {errors.category && (
                  <p className=" mt-2 text-red-400">{`${errors.category.message}`}</p>
                )}
              </div> */}
              {/* price */}
              {/* <div className="mb-6">
          <label className="flex mb-1 text-sm font-medium  w-full sm:w-6/6 text-white text-left">
            How much do you wish to charge for your shoutouts?
          </label>
          <input
            {...register("price", {
              required: "Pick a price",
            })}
            type="number"
            className={inputStyle}
            placeholder="$0.00"
          />
          {errors.price && (
            <p className=" mt-2 text-red-400">{`${errors.price.message}`}</p>
          )}
        </div> */}
              {/* email  */}
              <div className="border-1 relative">
                <label className="block text-sm font-medium mb-2 w-full sm:w-4/6 text-white text-left">
                  Add your email address
                </label>{" "}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <input
                    {...register("email", {
                      required: "email field is required",
                    })}
                    type="text"
                    className={cn(inputStyle, "bg-[#201e23]") }
                    placeholder="email address"
                  />
                  {errors.email && (
                    <p className=" mt-2 text-red-400">{`${errors.email.message}`}</p>
                  )}
                </div>
              </div>
              {/* <!-- Password input --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="password"
                  {...register("password", {
                    required: "password is required",
                    minLength: {
                      value: 6,
                      message: "min leng is 6 charecter",
                    },
                  })}
                  className={cn(inputStyle, "bg-[#201e23]") }
                  placeholder="Password"
                />
                {errors.password && (
                  <p className=" mt-2 text-red-400">{`${errors.password.message}`}</p>
                )}
              </div>
              {/* <!-- confirm password --> */}
              <div className="relative mb-6" data-te-input-wrapper-init>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("password") || "password must match",
                  })}
                  className={cn(inputStyle, "bg-[#201e23]") }
                  placeholder="confirmPassword"
                />
                {errors.confirmPassword && (
                  <p className=" mt-2 text-red-400">{`${errors.confirmPassword.message}`}</p>
                )}
              </div>
              {/* Message to US*/}
              <div className="">
                <div className="text-left">
                  Anything else you'd like us to know?
                </div>
                <textarea
                  {...register("MessageToUs")}
                  className={cn(inputStyle, "bg-[#201e23] py-2 my-3 h-40") }

                />
              </div>
              {/* <!-- Image --> */}
              {/* {errors.imgfile && (
          <p className=" mt-2 text-red-400">{`${errors.imgfile.message}`}</p>
        )} */}
              {/* <div
          className="relative mb-2  h-[50px] border"
          data-te-input-wrapper-init
        > */}
              {/* <input
            type="file"
            {...register("imgfile", {
              required: "choose profile image",
            })}
            onChange={handleFileChange}
            className={
              inputStyle + " border-none right-0 w-[50%] h-[50px] absolute"
            }
          /> */}
              {/* <SelectLabel htmlFor="picture">Picture</Label> */}
              {/* <div className="grid w-full max-w-sm items-center gap-1.5 my-3 ">
          <Label htmlFor="picture" className="text-left">
            Choose a profile image
          </Label>
          <Input className="cursor-pointer" id="picture" type="file" />
        </div> */}
              {/* <label
            htmlFor="exampleFormControlInput33"
            className=" absolute right-2 top-3"
          >
            Pick a Profile image
          </label> */}
              {/* </div> */}
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
                disabled={isSubmitting}
                type="submit"
                className="inline-block w-full bg-[#5e7dc2] disabled:bg-gray-600 mb-5 rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light"
              >
                Join
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignupCeleb;
