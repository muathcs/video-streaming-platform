import { Navigate, redirect, useLocation } from "react-router-dom";
import Modal from "../Modal";
import { useState } from "react";
import ReviewInput from "../ReviewInput";

function FulFilled() {
  const [openModal, setOpenModal] = useState(false);

  const location = useLocation();
  const { state } = location || {};
  let request: any, celeb;

  if (state) {
    // `state` exists, you can safely destructure it
    ({ request, celeb } = state);

    // Rest of your code
  } else {
    return;
    <Navigate to={"/login"} />;
  }

  if (!state) {
    redirect("/");
  }

  function downloadVideo() {
    const link = document.createElement("a");
    link.href = request.celebmessage;
    link.target = "_blank";
    document.body.appendChild(link);
    link.setAttribute("download", `tesxtc`); //set file name
    link.click();
  }

  return (
    <div className="w-full  py-10 gap-5  flex justify-center items-start bg-black">
      <div className="w-3/4  flex flex-col items-center justify-start gap-5 ">
        <div className=" flex items-center justify-center flex-col gap-5">
          <div className="border border-gray-600 h-1/6 md:w-2/4 w-full  rounded-lg p-5 ">
            You requested a {request.reqtype} from {celeb.displayname} on{" "}
            {request.timestamp1}.{" "}
          </div>
          <div className="border border-gray-600 h-1/6 md:w-2/4 w-full rounded-lg p-5 ">
            Your req id is {request.requestid}, if there is an issue with your
            request, please contact our customer support{" "}
          </div>
          <Modal openModal={openModal} setOpenModal={setOpenModal}>
            <ReviewInput
              requestid={request.requestid}
              setOpenModal={setOpenModal}
              celebuid={request.celebuid}
              fanuid={request.fanuid}
              date={request.timestamp1}
              event={request.reqaction}
            />
          </Modal>
          <div className="border border-gray-600  h-4/6 md:w-2/4 w-full rounded-lg p-5   ">
            {request.reqtype == "video" ? (
              <>
                <video
                  className="recorded w-full h-full   "
                  src={request.celebmessage}
                  controls
                />
              </>
            ) : (
              <>
                <div>
                  <h1>Something went wrong</h1>
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={downloadVideo}
          className="w-2/4 py-4 bg-blue-300 hover:bg-blue-400 rounded-md relative text-lg "
        >
          Download Video
        </button>

        <button
          onClick={() => setOpenModal(true)}
          className=" border border-gray-600 w-2/4 py-4 rounded-lg hover:bg-[#37313d] "
        >
          Leave a Review
        </button>
      </div>
    </div>
  );
}

export default FulFilled;
