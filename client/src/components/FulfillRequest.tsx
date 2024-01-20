import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import FulfillVideo from "./fulfillRequest/FulfillVideo";
import FulfillAudio from "./fulfillRequest/FulfillAudio";
import FulfillMessage from "./fulfillRequest/FulfillMessage";
import { useGlobalAxios } from "../hooks/useGlobalAxios";

function FulfillRequest() {
  // prettier-ignore
  const [celebReply, setCelebReply] = useState<FormData | string>("");

  //this reducer forces the fullfillVideo componenet to rerender when I press the record video button again.
  const [reRecord, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: putData } = useGlobalAxios("put");

  // const { requestId } = useParams();

  //Coming from Dashboard.tsx navigate("/fulfill")
  // the useLocation returns a state with an object holding the information for the user request.
  const { state } = useLocation();

  async function handleFulfill(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    // set the state to the formData, in the server, the req.file will hold the first state
    // we set to our fd, the req.body will hold everything else in the fd, in this case that'll only be the state.
    celebReply instanceof FormData &&
      celebReply.append("state", JSON.stringify(state));

    console.log(celebReply);

    // Now formDataEntries is an array of key-value pairs
    console.log("statE: ", state);

    if (state.reqtype == "message") {
      console.log("here msg");
      putData(`/fulfill/${state.requestid}`, { celebReply });
    } else {
      putData(`/fulfill/${state.requestid}`, celebReply);
    }

    // Delete the "state" entry to reset the FormData object
    celebReply instanceof FormData && celebReply.delete("state");
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
