import { useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function SignupUser({
  createUser,
  handleFileChange,
}: {
  createUser: any;
  handleFileChange: any;
}) {
  // start here
  const [rememberMe, setRememberMe] = useState<boolean>();
  const [user, setUser] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  // async function createAUser(e: any) {
  //   const { name, value, innerText } = e.target;

  //   setUser({
  //     ...user,
  //     [name !== undefined ? name : "remote"]:
  //       value !== undefined ? value.toLowerCase() : innerText,
  //   });
  // }

  const onSubmit = async (data: FieldValues) => {
    const values = getValues();

    createUser(data, false);

    // reset(); // true indiciates this is a celeb being created.

    // reset();
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          // onSubmit={(e) =>
          //   handleSubmit(
          //     e,
          //     userNameRef.current.value,
          //     emailRef.current.value,
          //     passwordRef.current.value,
          //     passwordConfirmRef.current.value,
          //     user,
          //     true
          //   )
          // }
        >
          {/* <!-- username input --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="text"
              {...register("displayname", {
                required: "displayname is required",
              })}
              className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] 
                      "
              placeholder="displayname"
            />
            {errors.displayname && (
              <p className=" mt-2 text-red-400">{`${errors.displayname.message}`}</p>
            )}
          </div>
          {/* email  */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="text"
              {...register("email", {
                required: "Email is required",
              })}
              className="peer block min-h-[auto] w-full rounded border bg-transparent
                     px-3 py-[0.32rem] leading-[2.15] 
              "
              placeholder="email"
            />
            {errors.email && (
              <p className=" mt-2 text-red-400">{`${errors.email.message}`}</p>
            )}
          </div>

          {/* <!-- Password input --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <input
              type="password"
              {...register("password", {
                required: "password is required",
                minLength: {
                  value: 10,
                  message: "password must be at least 10 charecters",
                },
              })}
              className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15]  "
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
              className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15]  "
              placeholder="confirmPassword"
            />
            {errors.confirmPassword && (
              <p className=" mt-2 text-red-400">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>
          {/* <!-- Description  --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <textarea
              {...register("description")}
              className="peer block min-h-[auto] w-full rounded border bg-transparent px-3 py-[0.32rem] leading-[2.15]"
              placeholder="description (optional)"
            />
          </div>
          {/* <!-- Image --> */}
          <div
            className="relative mb-2  h-[50px] border"
            data-te-input-wrapper-init
          >
            <input
              type="file"
              {...register("imgfile")}
              onChange={handleFileChange}
              className=" block min-h-[auto] w-2/4 rounded 
                     bg-transparent px-3 py-[0.32rem] leading-[2.15] cursor-pointer
                      "
            />

            <label
              htmlFor="exampleFormControlInput33"
              className="absolute right-2 top-3 cursor-pointer"
            >
              Pick a Profile image
            </label>
          </div>

          {/* <!-- Remember me checkbox --> */}
          <div className="mb-4 flex items-center justify-between ">
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

          {/* <!-- Submit button --> */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-block w-full bg-[#5e7dc2] disabled:bg-gray-600 mb-5 rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white "
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
