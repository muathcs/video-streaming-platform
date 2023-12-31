import React from "react";
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
