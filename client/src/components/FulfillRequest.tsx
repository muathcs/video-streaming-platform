import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";
import FulfillVideo from "./fulfillRequest/FulfillVideo";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { ToastContainer, toast } from "react-toastify";
import { apiUrl } from "../utilities/fetchPath";

function FulfillRequest() {
  const [celebReply, setCelebReply] = useState<FormData | string>("");
  const [reRecord, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: sendPutRequest, error } = useGlobalAxios("put");
  const { data: sendPostRequest } = useGlobalAxios("post");
  const { state } = useLocation();
  const [recordOption, setRecordOption] = useState("");

  async function handleFulfill(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (celebReply instanceof FormData) {
      celebReply.append("state", JSON.stringify(state));
    }

    sendPutRequest(`${apiUrl}/request/fulfill/${state.requestid}`, celebReply);

    if (!error) {
      notify();
    }

    sendPostRequest(`${apiUrl}/notification`, {
      intended_uid: state.fanuid,
      sender_uid: state.celebuid,
      message: "Your request has been fulfilled",
    });

    if (celebReply instanceof FormData) {
      celebReply.delete("state");
    }
  }

  const toggleRecordOption = () => {
    forceUpdate();
    setRecordOption("video");
  };

  useEffect(() => {
    setRecordOption("");
  }, []);

  const notify = () => {
    toast.success("Success! Request sent, but you can still re-record if needed.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {state && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Fulfill Fan's Request</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                <p className="mb-2"><span className="font-medium">From:</span> {state.fromperson}</p>
                <p className="mb-2"><span className="font-medium">To:</span> {state.toperson}</p>
                <p className="mb-2"><span className="font-medium">Message:</span> {state.message}</p>
                <p><span className="font-medium">Request Type:</span> {state.reqtype}</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Record Your Response</h2>
                <button
                  className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                  onClick={() => {
                    forceUpdate();
                    toggleRecordOption();
                  }}
                >
                  {recordOption === "video" ? "Re-Record Video" : "Record Video"}
                </button>
                {recordOption === "video" && (
                  <div className="mt-4">
                    <FulfillVideo
                      reRecord={reRecord}
                      setCelebReply={setCelebReply}
                    />
                  </div>
                )}
              </div>
              {celebReply && (
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <button
                    onClick={handleFulfill}
                    className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
                  >
                    Send Fulfillment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FulfillRequest;
