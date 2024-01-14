import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc } from "firebase/firestore";
import completePic from "../assets/complete.png";
import { MdOutlinePendingActions } from "react-icons/md";
import FulFilled from "./fulfillRequest/FulFilled";

interface FanRequestContainerProp {
  request: {
    message: string;
    reqtype: string;
    reqaction: string;
    timestamp1: string;
    reqstatus: string;
    celebmessage: string;
    requestid: string;
  };
  celeb: {
    uid: string;
    displayname: string;
    imgurl: string;
  };
  setViewFulfilled: React.Dispatch<React.SetStateAction<string | null>>;
}

//this component has the various requests a user has made to diff celebs, and the status of those requestS(fulfilled or pending.)
// if a request is fulfilled, the user can click the view button, which will display the fulfiled componenet.
function FanRequestContainer({
  request,
  celeb,
  setViewFulfilled,
}: FanRequestContainerProp) {
  const {
    message,
    reqtype,
    reqaction,
    timestamp1,
    reqstatus,
    celebmessage,
    requestid,
  } = request;
  const { displayname: celebName, imgurl: celebPhoto } = celeb;

  const { currentUser }: any = useAuth();

  const [msg, setMsg] = useState("");

  function downloadVideo() {
    const data = celebmessage; // this logs a link to my S3, and I can view the vide.
    const blob = new Blob([data], { type: "video/webm" });

    const url = window.URL.createObjectURL(blob);
    setMsg(data);
    const link = document.createElement("a");
    link.href = celebmessage;
    link.target = "_blank";
    document.body.appendChild(link);
    link.setAttribute("download", `tesxtc`); //set file name
    link.click();
  }

  return (
    <div className=" cursor-pointer w-full flex justify-center items-center mt-10   ">
      <div className="relative flex p-5 flex-col items-center   md:flex-row    md:w-1/2 rounded-lg  shadow-sm shadow-red-500 border-4  border-gray-700 bg-gray-800 hover:bg-gray-700">
        <div className=" w-1/3 h-[350px]  ">
          <img
            className="rounded-lg border w-full h-full object-cover relative   border-gray-600 "
            src={currentUser && celebPhoto}
            alt=""
          />
        </div>
        <div>
          <div className=" h-[250px] ml-5 ">
            <p className="   text-lg wotfard ">
              Your Request to {celebName} is{" "}
              {reqstatus == "fulfilled"
                ? "fulfilled"
                : reqstatus == "pending"
                ? "still pending"
                : null}
            </p>
            <span className=" absolute bottom-0 right-0 w-1/2 h-1/2 ">
              {reqstatus == "fulfilled" ? (
                <>
                  <img
                    src={completePic}
                    width={100}
                    className=" absolute bottom-32 right-5"
                  />
                  <button
                    onClick={(e) => setViewFulfilled(requestid)}
                    className=" absolute bottom-5 right-2 px-10 py-3 bg-purple-500 rounded-lg hover:bg-purple-600"
                  >
                    View
                  </button>
                </>
              ) : reqstatus == "pending" ? (
                <>
                  <span className="absolute bottom-32 right-6 text-[5rem] ">
                    <MdOutlinePendingActions width="33" />
                  </span>
                  <span className="absolute bottom-5 right-2 px-10 py-3 bg-purple-500 rounded-lg ">
                    Expected: 12/12/2024
                  </span>
                </>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
