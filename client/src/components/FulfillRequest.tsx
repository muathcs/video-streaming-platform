import React, { useEffect, useReducer, useState } from "react";
import axios from "../api/axios";
import { useLocation } from "react-router-dom";
import FulfillVideo from "./fulfillRequest/FulfillVideo";
import FulfillAudio from "./fulfillRequest/FulfillAudio";
import FulfillMessage from "./fulfillRequest/FulfillMessage";

// type CelebReplyType = {
//   Bucket: string;
//   Key: string;
//   Body: Blob;
//   ContentType: string;
// };
function FulfillRequest() {
  // prettier-ignore
  const [celebReply, setCelebReply] = useState<any | undefined | string>();

  //this reducer forces the fullfillVideo componenet to rerender when I press the record video button again.
  const [reRecord, forceUpdate] = useReducer((x) => x + 1, 0);

  // const { requestId } = useParams();

  const { state } = useLocation();

  async function handleFulfill(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    console.log("celeb reply before send: ", celebReply?.get("videoFile"));

    let blob;

    if (celebReply && typeof celebReply !== "string") {
      blob = celebReply.Body; // TypeScript now knows celebReply is of type CelebReplyType
      console.log("this: ", blob);
      // Do something with body
    } else {
      // Handle the case when celebReply is a string
    }

    // sendPutRequest(`http://localhost:3001/fulfill/${state.requestid}`, {
    //   state,
    //   celebReply: celebReply,
    //   blob: blob,
    // });

    celebReply.append("state", JSON.stringify(state));

    try {
      await axios.put(`/fulfill/${state.requestid}`, celebReply);
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
