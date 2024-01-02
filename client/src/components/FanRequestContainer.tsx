import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface RequestProp {
  message: string;
  reqtype: string;
  requestaction: string;
  timestamp1: string;
  requeststatus: string;
  celebName: string;
  celebPhoto: string;
  celebmessage: string;
  requestid: string;
}
function FanRequestContainer({
  message,
  reqtype,
  requestaction,
  timestamp1,
  requeststatus,
  celebName,
  celebPhoto,
  celebmessage,
  requestid,
}: RequestProp) {
  const { currentUser }: any = useAuth();

  function downloadVideo() {
    console.log(celebmessage); //https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/video/1704031933382.webm
    const url = window.URL.createObjectURL(
      new Blob([celebmessage], { type: "video/webm" })
    );

    console.log(url); //  'blob:http://localhost:5173/603744a1-d0b2-4b1d-bed5-b84492efee08'

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${celebName}-Video2-${requestid}`);
    document.body.appendChild(link);
    // Start download
    link.click();

    // if (link.parentNode) link.parentNode.removeChild(link);

    // Clean up and remove the link
    //append the DOM
  }

  console.log("request Type: ", reqtype);

  return (
    <div className=" cursor-pointer w-full flex justify-center items-center mt-10  ">
      <div className="flex p-5 flex-col items-center   md:flex-row    md:w-1/2 rounded-lg shadow-sm shadow-red-500 border-4  border-gray-700 bg-gray-800 hover:bg-gray-700">
        <div className=" w-1/3 h-1/4">
          <img
            className="rounded-lg border w-[250px] h-[250px]  object-fill border-gray-600 "
            src={currentUser && celebPhoto}
            alt=""
          />
        </div>
        <div>
          <p>message:{requestid}</p>
          <p>message:{celebmessage}</p>
          {requeststatus == "fulfilled" && reqtype == "audio" ? (
            <>
              <audio src={celebmessage} controls className=" relative " />
            </>
          ) : reqtype == "video" ? (
            <>
              <video
                className="recorded w-1/2   "
                src={celebmessage}
                controls
              />
              {celebmessage}
              <button
                onClick={downloadVideo}
                className="px-5 py-3 bg-blue-300 rounded-md relative top-10"
              >
                Download Video
              </button>
              {/* <a
                className="px-5 py-3 bg-blue-300 rounded-md relative top-10"
                download
                type="application/octet-stream"
                href={celebmessage}
              >
                Download video
              </a> */}
            </>
          ) : reqtype == "message" ? (
            <>
              <p>{message}</p>
            </>
          ) : (
            <h1>Nothing</h1>
          )}

          <div className="flex flex-col justify-between p-4 leading-normal ">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {celebName}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {message}
            </p>
            <p>{reqtype}</p>
            <p>data: {timestamp1}</p>
            <p>Status: {requeststatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
