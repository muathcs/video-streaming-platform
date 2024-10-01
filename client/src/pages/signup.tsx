import { useRef, useState } from "react";
import axios from "../api/axios";
// import s3 from "../utilities/S3";
import { useAuth } from "../context/AuthContext";
import SignupCeleb from "./SignupCeleb";
import SignupUser from "./SignupUser";
import { apiUrl } from "../utilities/fetchPath";
// import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { AWS_LINK } from "../utilities/awsLink";
import { useNavigate } from "react-router-dom";
import AccountSuccess from "@/components/TalentAccountSuccessMessage";
function SignUp() {
  // start
  const { signup, uploadProfilePic }: any = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successfull, setSuccessfull] = useState<string>("");
  // const { data: sendpostrequest } = useGlobalAxios("post");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const navigate = useNavigate();

  //loooooooooooong function, because I tried to give the User and Celeb signup the same function
  async function handleSubmit(data: any, isCeleb: boolean) {
    // e.preventDefault();

    const { email, displayname, password, confirmPassword, imgfile } = data;

    //if password doesn't match.
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setSuccessfull("user created successfully!");

      setLoading(true);
      const userid = await signup(email, password, displayname);

      let imgUrl: string = "http:test/nothing"
      if (selectedFile){
        imgUrl = await handleUpload(userid.uid); // returns url with selected file name only if file is selected. .

      }

      const fireBaseUrlLink = AWS_LINK + imgUrl; // this link adds the AWS S3 Storage url, to the img url

      await uploadProfilePic(fireBaseUrlLink, userid); // uploads the profile pic to firebase user.

      const path = isCeleb
        ? `${apiUrl}/celebs/createCeleb`
        : `${apiUrl}/fan/createUser`; // if the celeb is being created, create a celeb on the server and vice versa.

      const fd = new FormData()

      fd.append("payLoad", JSON.stringify(data));
      fd.append("uid", userid.uid);
      fd.append("imgurl", imgUrl);

      if (selectedFile) {
        fd.append("file", selectedFile);
      }

      try {
        await axios.post(path, fd);
      } catch (error) {
        console.error("error: ", error);
      }

      // navigate("/");
    } catch (error) {
      setSuccessfull("");
      console.error("failed to create an account", error);
    }

    if (isCeleb) {
      navigate("");
    }
    setLoading(false);
    // setSuccessfull(false);
  }

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);

    console.log("on file change", e.target.files[0]);
  };

  const handleUpload = async (key: string) => {
    console.log(key);
    if (selectedFile) {
      const imgURL = `profile/user(${key})`; // img link, the will be sent to S3, with the useruid being the unique identifier. check path /createuser or /createceleb on server.

      return imgURL;
    } else {
      console.warn("No file selected for upload."); // this returns an empty string if the user doesn't choose an img.
      return "";
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
    <div className=" bg-black  ">
      {successMessage ? (
        <AccountSuccess />
      ) : (
        <section className=" bg-black flex justify-center">
          <div className="container h-full px-6 py-24 ">
            <div className="g-6 flex h-full flex-wrap sm:items-center items-start justify-center lg:justify-between ">
              {/* <!-- Left column container with background--> */}
              <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12 hidden sm:block">
                <img
                  src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                  className="w-full"
                  alt="image"
                />
              </div>

              {/* <!-- Right column container with form --> */}
              <div className="md:w-8/12 lg:ml-6 lg:w-5/12 w-[90%] relative">
                <h1 className="text-[30px]  mb-10 text-center font-semibold">Sign Up</h1>
                {error ? (
                  <p className="bg-red-200 border text-black border-red-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                    {error}
                  </p>
                ) : successfull ? (
                  <p className="bg-green-200 border text-lg text-black border-green-600 w-full rounded-lg text-center sm:p-4 p-3 relative mb sm:top-2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                    {successfull}
                  </p>
                ) : null}

                {/* <div className="flex justify-center gap-5 mb-3">
                  <button
                    onClick={() => {
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
                    onClick={() => {
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
                </div> */}
                <div className="">
                  {selected == "celeb" ? (
                    <h1>Remove this</h1>
                  ) : (
                    // <SignupCeleb
                    //   createUser={handleSubmit}
                    //   handleFileChange={handleFileChange}
                    //   setSuccessMessage={setSuccessMessage}
                    // />
                    <SignupUser
                      createUser={handleSubmit}
                      handleFileChange={handleFileChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default SignUp;
