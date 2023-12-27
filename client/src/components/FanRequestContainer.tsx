import React from "react";
import { useAuth } from "../context/AuthContext";

function FanRequestContainer({
  message,
  reqType,
  requestaction,
  timestamp1,
  requeststatus,
  celebName,
  celebPhoto,
}) {
  const { currentUser }: any = useAuth();

  return (
    <div className=" h-full flex justify-center items-center ">
      <div className=" cursor-pointer ">
        <div className="flex p-5 flex-col items-center  bg-white border border-white rounded-lg  shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
          <img
            className="object-cover rounded-t-lg  md:rounded-none md:rounded-s-lg h-full"
            src={currentUser && celebPhoto}
            width={200}
            alt=""
          />
          <div className="flex flex-col justify-between p-4 leading-normal ">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {celebName}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {message}
            </p>
            <p>{reqType}</p>
            <p>data: {timestamp1}</p>
            <p>Status: {requeststatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
