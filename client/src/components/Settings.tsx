import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FieldValues, useForm } from "react-hook-form";
import { SocialMediaType } from "../TsTypes/types";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
function PublicProfileSettings({
  userInfo,
  celeb,
  currentUser,
  onSubmit,
}: any) {
  const socialMedias: SocialMediaType[] = [
    { name: "tiktok" },
    { name: "twitter" },
    { name: "instagram" },
    { name: "facebook" },
    { name: "snapchat" },
  ];

  const navigate = useNavigate();
  const [mostPopularSocialMedia, setMostPopularSocialMedia] =
    useState<string>("");

  const [email, setEmail] = useState<string>(userInfo?.email || "");
  const [imgUrl, setImgUrl] = useState<string>(userInfo?.imgurl || "");

  console.log("imgurlx: ", imgUrl);
  const [description, setDescription] = useState<string>(
    userInfo?.description || ""
  );
  const [displayName, setDisplayName] = useState<string>(
    userInfo?.displayname || ""
  );
  const [price, setPrice] = useState<number>(userInfo?.price || 0);
  const [app, setApp] = useState<string>(userInfo?.app || "");
  const [category, setCategory] = useState(userInfo?.category || "");
  const followers = userInfo?.followers || 0;

  const [selectedFile, setSelectedFile] = useState<File>();

  const additionalValues = celeb
    ? {
        app: app,
        followers: followers,
        price: price,
      }
    : {};

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      imgurl: imgUrl,
      displayName: displayName,
      email: email,
      description: description,
      price: price,
      category: category,
      ...additionalValues,
    },
  });
  function handleFileChange(e: any) {
    setSelectedFile(e.target.files[0]);

    const values = getValues();
  }

  console.log("new: ", userInfo);

  return (
    <div className="p-2 md:p-4">
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>

        <form onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}>
          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <img
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                src={imgUrl}
                alt="Bordered avatar"
              />

              <div className="flex flex-col space-y-5 ml-2 lg:ml-8">
                <input
                  type="file"
                  {...register("imgurl")}
                  onChange={handleFileChange}
                  // value="Change picture"
                  className="py-3.5  lg:px-7 px-2 text-center  font-medium text-indigo-100 cursor-pointer focus:outline-none bg-[#202142] rounded-lg  "
                />
                <button
                  type="button"
                  className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                >
                  Delete picture
                </button>
              </div>
            </div>

            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label
                    htmlFor="displayName"
                    className="block mb-2 text-sm font-medium text-left"
                  >
                    Display Name:
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    placeholder="display name"
                    // onChange={(e) => setUserName(e.target.value)}
                    // {...register("username", {
                    //   defaultValue:
                    // })}

                    {...register("displayName")}
                    // value={username}
                    required
                  />
                </div>
              </div>

              {/* <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("displayName")}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  placeholder="your email"
                />
              </div> */}
              {celeb && (
                <>
                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="profession"
                      className="block mb-2 text-sm font-medium text-indigo-900 "
                    >
                      Profession
                    </label>
                    <select
                      {...register("category", {
                        required:
                          "pick a category, choose other if nothing applies to you.",
                      })}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      name="category"
                      data-te-select-init
                      className="w-full h-10 pl-2 rounded-md bg-transparent  border text-black cursor-pointer"
                    >
                      <option value="actors">actors</option>
                      <option value="business">business</option>
                      <option value="reality-tv">reality-tv</option>
                      <option value="athletes">athletes</option>
                      <option value="comedians">comedians</option>
                      <option value="Footballers">Footballers</option>
                      <option value="other">other</option>
                    </select>
                  </div>
                  <div
                    className="relative mb-6 flex gap-3  sm:flex-row flex-wrap"
                    data-te-input-wrapper-init
                  >
                    {socialMedias.map((app) => (
                      <button
                        {...register("app")}
                        type="button"
                        onClick={() => {
                          setValue("app", app.name);
                          setMostPopularSocialMedia(app.name);
                        }}
                        className="w-28 border rounded-md py-2 border-gray-300"
                        style={{
                          background:
                            mostPopularSocialMedia == app.name ? "grey" : "",
                        }}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                  <div className="mb-2 sm:mb-6 flex justify-around">
                    <div className="">
                      <label className="block mb-2 text-sm font-medium text-indigo-900 ">
                        Follwers
                      </label>
                      <input
                        type="number"
                        {...register("followers")}
                        id="profession"
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="followers"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-indigo-900 ">
                        Price
                      </label>
                      <input
                        type="number"
                        id="profession"
                        {...register("price", {
                          required: "Price cannot be empty",
                        })}
                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="price"
                        required
                      />
                      {errors.price && (
                        <p className=" mt-2 rounded-md text-red-600">{`${errors.price.message}`}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                >
                  Bio
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("description")}
                  className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
                  placeholder="Write your bio here..."
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoginSettings({ userInfo, currentUser, celeb, notify }: any) {
  const { reauthenticateUser, login }: any = useAuth();
  const { data: sendPutRequest, error } = useGlobalAxios("put");
  const [tempError, setTempError] = useState<string>("");

  const [email, setEmail] = useState(userInfo.email);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      email: email,
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: FieldValues) {
    const status = celeb ? "celeb" : "fan";
    console.log("here");
    setTempError("");

    //change email
    if (email != data.email && !data.password) {
      setTempError(
        "You're attempting to change your email!, please input your password aswell"
      );
    } else if (email != data.email && data.password) {
      const updateCreds = await reauthenticateUser(data.password);

      if (updateCreds && !updateCreds.state) {
        notify("wrong password couldn't update", "error");
        return;
      }

      const response = await sendPutRequest(
        `${apiUrl}/update/login/email/${currentUser.uid}`,
        {
          email,
          data,
          status,
        }
      );

      console.log("response: ", response);

      if (response.status == 201) {
        await reauthenticateUser(data.password);
        notify(response.data.message);
      }
    }

    //change password

    //should probably move to a different funciton

    if (data.newPassword && data.newPassword != data.confirmNewPassword) {
      setTempError(
        "Your new password does not match the confirm new password field"
      );
      console.log("new password doesn't match");
    } else if (
      data.newPassword &&
      data.newPassword == data.confirmNewPassword &&
      !data.password
    ) {
      setTempError(
        "To update your password you must input you old password first"
      );
    } else if (
      data.newPassword &&
      data.newPassword == data.confirmNewPassword
    ) {
      const updateCreds = await reauthenticateUser(data.password);

      if (updateCreds && !updateCreds.state) {
        notify("wrong password couldn't update", "error");
        return;
      }

      const response = await sendPutRequest(
        `${apiUrl}/update/login/password/${currentUser.uid}`,
        { data }
      );

      if (response.status == 201) {
        await reauthenticateUser(data.newPassword);

        notify(response.data.message);
      }
      console.log(response);
      // sendPutRequest(`/update/login/${currentUser.uid}`, { email });
    }
  }

  return (
    <div className="p-2 md:p-4">
      <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
        <h2 className="pl-6 text-2xl font-bold sm:text-xl">
          Login Information
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid max-w-2xl mx-auto mt-8">
            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label
                    htmlFor="displayName"
                    className="block mb-2 text-sm font-medium text-left"
                  >
                    email:
                  </label>

                  <input
                    type="text"
                    id="email"
                    {...register("email")}
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    placeholder="your email"
                    // onChange={(e) => setUserName(e.target.value)}
                    // {...register("username", {
                    //   defaultValue:
                    // })}

                    // value={username}
                  />
                  <p>{tempError}</p>
                </div>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-indigo-900 text-left"
                >
                  Your old password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    minLength: 6,
                  })}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  placeholder="your password"
                />
              </div>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-900  text-left"
                >
                  Your new password
                </label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  placeholder="your email"
                />
                {errors.newPassword && (
                  <p className=" mt-2 rounded-md text-red-600">{`${errors.newPassword.message}`}</p>
                )}
              </div>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="new password"
                  className="block mb-2 text-sm font-medium text-indigo-900  text-left"
                >
                  confirm you new password
                </label>
                <input
                  type="password"
                  {...register("confirmNewPassword")}
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  placeholder="confirm new password"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Settings() {
  const { userInfo, currentUser, celeb }: any = useAuth();
  const [activeSection, setActiveSection] = useState<string>("public");
  const { data: sendPutRequest, error } = useGlobalAxios("put");
  const navigate = useNavigate();

  const notify = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  useEffect(() => {
    console.log("useEffect", "userinfo: ", userInfo, "current: ", currentUser);
    if (!userInfo || !currentUser) {
      navigate("/login");
    }
  }, []);

  async function onSubmit(data: FieldValues, selectedFile: File) {
    console.log("onsubmit");
    let fd = new FormData();
    const status = celeb ? "celeb" : "fan";

    if (selectedFile) {
      console.log("file is selected: ", selectedFile);
      fd.append("file", selectedFile);
    }
    fd.append("status", status);
    fd.append("payLoad", JSON.stringify(data));

    try {
      console.log("here submit");
      const response = await sendPutRequest(
        `${apiUrl}/update/${currentUser.uid}`,
        fd
      );

      if (response.status == 201) {
        notify(response.data.message);
      }
    } catch (err) {
      console.error("putreq: ", err);
    }
  }
  return (
    <>
      <div className="bg-white w-full flex flex-col gap-5 md:px-16 lg:px-28 md:flex-row text-[#161931]">
        <ToastContainer
          position="top-center"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ width: "500px", height: "5100px", marginTop: 100 }}
        />
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block ">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12 ">
            <h2 className="pl-3 mb-4 text-2xl font-semibold ">Settings</h2>

            <p
              onClick={(e) => setActiveSection("public")}
              className="flex items-center px-3 py-2.5 font-bold bg-white  text-indigo-900 border rounded-full cursor-pointer"
            >
              Pubic Profile
            </p>
            <p
              onClick={(e) => setActiveSection("login")}
              className="flex items-center px-3 py-2.5 font-bold bg-white  text-indigo-900 border rounded-full cursor-pointer"
            >
              Login Information
            </p>
          </div>
        </aside>
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4 ">
          {activeSection === "public" ? (
            <PublicProfileSettings
              userInfo={userInfo}
              currentUser={currentUser}
              celeb={celeb}
              onSubmit={onSubmit}
              notify={notify}
            />
          ) : (
            <LoginSettings
              userInfo={userInfo}
              currentUser={currentUser}
              celeb={celeb}
              notify={notify}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Settings;
