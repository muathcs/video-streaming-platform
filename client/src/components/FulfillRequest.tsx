import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useLocation, useParams } from "react-router-dom";
import { eventType } from "aws-sdk/clients/health";
import { useGlobalPut } from "../hooks/useGlobaPut";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import FulfillVideo from "./fulfillRequest/FulfillVideo";
import FulfillAudio from "./fulfillRequest/fulfillAudio";

function FulfillRequest() {
  const [celebMessage, setCelebMessage] = useState<string>();
  // const { requestId } = useParams();

  const { state } = useLocation();

  const {
    data: fulfillRequest,
    loading,
    error,
  } = useGlobalAxios("put", `puts`);

  async function handleFulfill(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    // console.log(putdata)
    console.log("message: ", state.requestid);

    fulfillRequest(`http://localhost:3001/fulfill/${state.requestid}`, {
      state: state,
      celebMessage: celebMessage,
    });

    try {
      const res = await axios.put(`/fulfill/${state.requestid}`, {
        state: state,
        celebMessage: celebMessage,
      });
    } catch (error) {
      console.error(error);
    }
  }

  let [recordOption, setRecordOption] = useState("");
  const toggleRecordOption = (type: any) => {
    return () => {
      setRecordOption(type);
    };
  };

  return (
    <div>
      {/* <div className=" flex flex-col items-center gap-5 text-[20px] wotfard">
        <div className="w-1/2 ">
          <p className="border border-red-200 w-full shadow-lg p-10 mt-2 shadow-red-500 ">
            From: Mimo{state.fromperson}
          </p>
        </div>
        <div className="w-1/2">
          <p className="border border-red-200 w-full shadow-lg p-10 mt-2 shadow-red-500">
            To: {state.toperson}
          </p>
        </div>
        <div className="w-1/2">
          <p className="border border-red-200 w-full shadow-lg p-10 mt-2 shadow-red-500">
            Message: {state.message}
          </p>
        </div>
        <div className="w-1/2">
          <div className="text-left">Step 3: Reply</div>
          <textarea
            onChange={(e) => setCelebMessage(e.target.value)}
            className=" block min-h-[auto] w-full  rounded border my-2 bg-transparent
                     px-2 py-2  h-40 shadow-lg shadow-red-400   outline-none placeholder-style  relative
                      "
            placeholder="I'm a huge fan of your incredible work. I have a special occasion coming up, and I was wondering if you could send a personalized shout-out or a few words of encouragement to make it even more memorable."
          />
        </div>
        <div className="">
          <button
            onClick={handleFulfill}
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
          >
            Fulfill
          </button>
        </div> */}

      <div>
        <h1>React Media Recorder</h1>
        <div className="button-flex">
          <button
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
            onClick={toggleRecordOption("video")}
          >
            Record Video
          </button>
          <button
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
            onClick={toggleRecordOption("audio")}
          >
            Record Audio
          </button>
        </div>
        <div>
          {recordOption === "video" ? <FulfillVideo /> : <FulfillAudio />}
        </div>
      </div>
    </div>
  );
}

export default FulfillRequest;
