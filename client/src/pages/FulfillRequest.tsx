import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import FulfillVideo from "../components/fulfillRequest/FulfillVideo";
import FulfillAudio from "../components/fulfillRequest/FulfillAudio";
import FulfillMessage from "../components/fulfillRequest/FulfillMessage";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { ToastContainer, toast } from "react-toastify";
import { apiUrl } from "../utilities/fetchPath";

function FulfillRequest() {
  // prettier-ignore
  const [celebReply, setCelebReply] = useState<FormData | string>("");

  //this reducer forces the fullfillVideo componenet to rerender when I press the record video button again.
  const [reRecord, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: sendPutRequest, error } = useGlobalAxios("put");
  const { data: sendPostRequest } = useGlobalAxios("post");

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

    // Now formDataEntries is an array of key-value pairs

    if (state.reqtype == "message") {
      sendPutRequest(`${apiUrl}/request/fulfill/${state.requestid}`, {
        celebReply,
      });
      if (!error) {
        notify(); //pop up notification
      }
    } else {
      sendPutRequest(
        `${apiUrl}/request/fulfill/${state.requestid}`,
        celebReply
      );

      if (!error) {
        notify(); //pop up notification
      }
    }

    sendPostRequest(`${apiUrl}/notification`, {
      intended_uid: state.fanuid,
      sender_uid: state.celebuid,
      message: "Your request has been fulfilled",
    });

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

  // for pop notification
  const notify = () => {
    toast.success("Success, request sent but you can still re-record it", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  return (
    <>
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
      {state && (
        <div className=" flex flex-col items-center gap-5 text-[20px] wotfard mt-20">
          <div className="w-1/2 ">
            <p className="border border-red-200 w-full  p-10 mt-2  ">
              From: Mimo{state.fromperson}
            </p>
          </div>
          <div className="w-1/2">
            <p className="border border-red-200 w-full  p-10 mt-2 ">
              To: {state.toperson}
            </p>
          </div>
          <div className="w-1/2">
            <p className="border border-red-200 w-full  p-10 mt-2 ">
              Message: {state.message}
            </p>
          </div>
          <div className="w-1/2">
            <p className="border border-red-200 w-full  p-10 mt-2 ">
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
                <FulfillVideo
                  reRecord={reRecord}
                  setCelebReply={setCelebReply}
                />
              ) : recordOption === "audio" ? (
                <FulfillAudio
                  reRecord={reRecord}
                  setCelebReply={setCelebReply}
                />
              ) : recordOption === "message" ? (
                <FulfillMessage setCelebReply={setCelebReply} />
              ) : null}
            </div>

            {celebReply && (
              <div className="w-full ">
                <button
                  onClick={handleFulfill}
                  className="px-12 py-4 m-2 bg-red-800 rounded-md hover:bg-red-900"
                >
                  Fulfill
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FulfillRequest;
