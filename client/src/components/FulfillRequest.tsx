import React, { useEffect, useReducer, useState } from "react";
import axios from "../api/axios";
import { useLocation } from "react-router-dom";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import FulfillVideo from "./fulfillRequest/FulfillVideo";
import FulfillAudio from "./fulfillRequest/FulfillAudio";
import FulfillMessage from "./fulfillRequest/FulfillMessage";

function FulfillRequest() {
  const [celebReply, setCelebReply] = useState<string | undefined>();

  //this reducer forces the fullfillVideo componenet to rerender when I press the record video button again.
  const [reRecord, forceUpdate] = useReducer((x) => x + 1, 0);

  // const { requestId } = useParams();

  const { state } = useLocation();

  const { data: fulfillRequest } = useGlobalAxios("put", `puts`);

  async function handleFulfill(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    fulfillRequest(`http://localhost:3001/fulfill/${state.requestid}`, {
      state: state,
      celebReply: celebReply,
    });

    try {
      await axios.put(`/fulfill/${state.requestid}`, {
        state: state,
        celebReply: celebReply,
      });
    } catch (error) {
      console.error(error);
    }
  }

  let [recordOption, setRecordOption] = useState("");
  const toggleRecordOption = (type: any) => {
    forceUpdate();
    setRecordOption(type);
  };

  useEffect(() => {
    // Ensure that recordOption is reset when the component mounts
    setRecordOption("");
  }, []);
  return (
    <div className=" flex flex-col items-center gap-5 text-[20px] wotfard">
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
        <p className="border border-red-200 w-full shadow-lg p-10 mt-2 shadow-red-500">
          Message: {state.reqtype}
        </p>
      </div>

      <div className=" h-full  w-1/2  ">
        <p>FulFill Fan's Request</p>
        <div className="button-flex">
          {state.reqtype === "video" ? (
            <button
              className="w-1/4 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
              onClick={() => {
                forceUpdate();

                toggleRecordOption("video");
              }}
            >
              Record Videoz
            </button>
          ) : state.reqtype === "audio" ? (
            <button
              className=" py-4 w-1/4 m-2 bg-red-800 rounded-md hover:bg-red-900"
              onClick={() => {
                toggleRecordOption("audio");
              }}
            >
              Record Audio
            </button>
          ) : state.reqtype === "message" ? (
            <button
              className="py-4 w-1/3 m-2 bg-red-800 rounded-md hover:bg-red-900"
              onClick={() => {
                toggleRecordOption("message");
              }}
            >
              Reply with a message
            </button>
          ) : null}
        </div>
        <div>
          {recordOption === "video" ? (
            <FulfillVideo reRecord={reRecord} setCelebReply={setCelebReply} />
          ) : recordOption === "audio" ? (
            <FulfillAudio reRecord={reRecord} setCelebReply={setCelebReply} />
          ) : recordOption === "message" ? (
            <FulfillMessage
              celebReply={celebReply}
              setCelebReply={setCelebReply}
            />
          ) : null}
        </div>

        <div className="w-full">
          <button
            onClick={handleFulfill}
            className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
          >
            Fulfill
          </button>
        </div>
      </div>
    </div>
  );
}

export default FulfillRequest;
