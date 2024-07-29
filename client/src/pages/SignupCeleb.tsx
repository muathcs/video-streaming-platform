import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { SocialMediaType } from "../TsTypes/types.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import AccountSuccess from "@/components/TalentAccountSuccessMessage.tsx";
import axios from "axios";
import { apiUrl } from "@/utilities/fetchPath.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

function SignupCeleb({}: {}) {
  const { signup }: any = useAuth();

  const [rememberMe, setRememberMe] = useState<boolean>();
  const [error, setError] = useState("");

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
    getValues,
  } = useForm();

  console.log("here");

  // async function onsubmit(data: FieldValues) {
  //   console.log("herex");
  //   console.log("successMessagE: ");
  //   console.log("here");
  //   await createUser(data, true);
  //   // setSuccessMessage(true);
  //   // reset(); // true indiciates this is a celeb being created.
  // }

  console.log("asfd: ", getValues().displayName);
  async function onSubmit(data: FieldValues) {
    try {
      const { displayName, email, password, confirmPassword } = data;

      //if password doesn't match.
      if (password !== confirmPassword) {
        return setError("Passwords do not match");
      }

      console.log("data: ", displayName, email, password);
      const userid = await signup(email, password, displayName);

      // const respones = axios.post(`${apiUrl}/celebs/createCeleb`, data);
    } catch (error) {
      console.error("onSubmitCeleb", error);
    }
  }

  const inputStyle =
    "peer block min-h-[auto] w-full   rounded border bg-transparent px-3 py-4 leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200   ";

  return (
    <div className=" max-w-7xl mx-auto mt-10 px-4">
      <div className="">
        <h1 className="text-7xl">
          Share Your <span className="text-purple-500">Hikaya</span> <br />
          and Get Rewarded
        </h1>
        <h2 className="text-gray-300 text-3xl mt-10 mb-5">
          Connect with your audience. <br />
          Start earning from your passion today.
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* <!-- display Name --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            type="text"
            className={inputStyle}
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
            className={inputStyle}
            placeholder="Legal Name"
            {...register("username", {
              required: "username is required",
            })}
          />
          {errors.username && (
            <p className=" mt-2 text-red-400">{`${errors.username.message}`}</p>
          )}
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
            className={inputStyle}
            placeholder="Password"
          />
          {errors.password && (
            <p className=" mt-2 text-red-400">{`${errors.password.message}`}</p>
          )}
        </div>
        {/* <!-- confirm password --> */}
        {/* <div className="relative mb-6" data-te-input-wrapper-init>
          <input
            type="confirmPassword"
            {...register("confirmPassword", {
              required: "confirm password is required",
            })}
            className={inputStyle}
            placeholder="confirm password "
          />
          {errors.confirmPassword && (
            <p className=" mt-2 text-red-400">{`${errors.confirmPassword.message}`}</p>
          )}
        </div> */}
        {/* <!-- Popular app input --> */}
        {/* <p className="text-left mb-2">
          Which App do you have the most followers on?{" "}
        </p>
        <div
          className="relative mb-6 flex gap-3  sm:flex-row flex-wrap "
          data-te-input-wrapper-init
        >
          {socialMedias.map((app) => (
            <button
              {...register("app", {
                required: "pick a social media app",
              })}
              type="button"
              onClick={() => {
                setValue("app", app.name);
                setMostPopularSocialMedia(app.name);
              }}
              className="w-28 border-2 border-white py-4"
              style={{
                background: mostPopularSocialMedia == app.name ? "grey" : "",
              }}
            >
              {app.name}
            </button>
          ))}
        </div> */}
        {/* {errors.app && (
          <p className=" mt-2 text-red-400">{`${errors.app.message}`}</p>
        )} */}
        {/* how many followers */}
        {/* {mostPopularSocialMedia && (
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
              className={inputStyle}
              placeholder={`How many followers do you have on ${mostPopularSocialMedia}`}
            />
            {errors.followers && (
              <p className=" mt-2 text-red-400">{`${errors.followers.message}`}</p>
            )}
          </div>
        )} */}
        {/* what is your @ */}
        {mostPopularSocialMedia && (
          <div className="mb-6">
            <input
              type="text"
              {...register("account", {
                required: "input your social media handle?",
              })}
              //   onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              placeholder={`What is your @ on ${mostPopularSocialMedia}`}
            />
            {errors.account && (
              <p className=" mt-2 text-red-400">{`${errors.account.message}`}</p>
            )}
          </div>
        )}
        {/* category */}
        <div className="relative mb-6 " data-te-input-wrapper-init>
          <label className="block text-sm font-medium mb-2 w-full sm:w-4/6 text-white text-left ">
            What is your largest following
          </label>
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
          <div className="z-20">
            <Select
              name="category"
              onValueChange={(e) => {
                console.log("E: ", e);
                setValue("category", e);
              }}
            >
              <SelectTrigger className=" border-2 border-white w-full z-10 py-6 ">
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent className="z-10">
                <SelectGroup
                  {...register("category", {
                    required: "Select a range for how many followers you have.",
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
                  <SelectItem className="cursor-pointer" value="100K-300k">
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
        </div>
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
              className={inputStyle}
              placeholder="email address"
            />
            {errors.email && (
              <p className=" mt-2 text-red-400">{`${errors.email.message}`}</p>
            )}
          </div>
        </div>
        {/* Message to US*/}
        <div className="">
          <div className="text-left">Anything else you'd like us to know?</div>
          <textarea
            {...register("description", {
              required: "description is required. ",
            })}
            className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                     px-2 py-2  h-40 shadow-sm shadow-blue-400   outline-none placeholder-style  relative
                      "
          />
        </div>
        {/* <!-- Image --> */}
        {errors.imgfile && (
          <p className=" mt-2 text-red-400">{`${errors.imgfile.message}`}</p>
        )}
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
    </div>
  );
}

export default SignupCeleb;
