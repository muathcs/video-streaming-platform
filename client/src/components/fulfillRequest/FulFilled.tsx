import { Navigate, redirect, useLocation } from "react-router-dom";

function FulFilled() {
  console.log(!useLocation());

  const location = useLocation();
  const { state } = location || {};
  let request: any, celeb;

  if (state) {
    // `state` exists, you can safely destructure it
    ({ request, celeb } = state);

    // Rest of your code
  } else {
    console.log("here return");
    return;
    <Navigate to={"/login"} />;
  }

  if (!state) {
    redirect("/");
  }

  console.log("stax", useLocation());
  function downloadVideo() {
    const link = document.createElement("a");
    link.href = request.celebmessage;
    link.target = "_blank";
    document.body.appendChild(link);
    link.setAttribute("download", `tesxtc`); //set file name
    link.click();
  }

  return (
    <div className="h-full w-full  py-10 gap-5  flex justify-center items-start ">
      <div className="w-3/4  h-5/6 flex flex-col items-center justify-start gap-5">
        <div className="border border-gray-600 h-1/6 w-2/4 rounded-lg p-5 ">
          You requested a {request.reqtype} from {celeb.displayname} on{" "}
          {request.timestamp1}.{" "}
        </div>
        <div className="border border-gray-600 h-1/6 w-2/4 rounded-lg p-5">
          Your req id is {request.requestid}, if there is an issue with your
          request, please contact our customer support{" "}
        </div>
        <div className="border border-gray-600  h-4/6 w-2/4 rounded-lg p-5  ">
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
                Download Audio
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
                className="w-full py-7 bg-blue-300 hover:bg-blue-400 rounded-md relative top-10 text-lg"
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
    </div>
  );
}

export default FulFilled;
