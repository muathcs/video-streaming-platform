import React from "react";

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

function FulFilled({ request, celeb }: FanRequestContainerProp) {
  function downloadVideo() {
    const link = document.createElement("a");
    link.href = request.celebmessage;
    link.target = "_blank";
    document.body.appendChild(link);
    link.setAttribute("download", `tesxtc`); //set file name
    link.click();
  }

  return (
    <div className="h-full w-full absolute flex flex-col items-center justify-start py-10 gap-5  ">
      <div className="border-2 bg-purple-600 h-1/6 w-1/4 rounded-lg p-5">
        You requested a {request.reqtype} from {celeb.displayname} on{" "}
        {request.timestamp1}.{" "}
      </div>
      <div className="border-2 bg-purple-600 h-1/6 w-1/4 rounded-lg p-5">
        Your req id is {request.requestid}, if there is an issue with your
        request, please contact our customer support{" "}
      </div>
      <div className="border-4 bg-purple-600 h-2/6 w-1/4 rounded-lg p-5  ">
        {request.reqtype == "audio" ? (
          <>
            <audio
              src={request.celebmessage}
              controls
              className=" relative  w-full h-full "
            />
            <button
              onClick={downloadVideo}
              className="px-5 py-3 bg-blue-300 rounded-md relative top-10"
            >
              Download Video
            </button>
          </>
        ) : request.reqtype == "video" ? (
          <>
            <video
              className="recorded w-full h-full   "
              src={request.celebmessage}
              controls
            />

            <button
              onClick={downloadVideo}
              className="px-5 py-3 bg-blue-300 rounded-md relative top-10"
            >
              Download Video
            </button>
          </>
        ) : request.reqtype == "message" ? (
          <>
            <p>{request.celebmessage}</p>
          </>
        ) : (
          <h1>Nothing</h1>
        )}
      </div>
    </div>
  );
}

export default FulFilled;
