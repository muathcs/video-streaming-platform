import { redirect, useLocation } from "react-router-dom";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import ReviewInput from "../ReviewInput";
import { RequestType } from "@/TsTypes/types";
import { apiUrl } from "@/utilities/fetchPath";
import axios from "@/api/axios";

function FulFilled() {
  const [openModal, setOpenModal] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string>("");
  const [rated, setRated] = useState<number>();

  const location = useLocation();
  const { state } = location || {};
  let request: RequestType, celeb;

  useEffect(() => {
    console.log("effect: ");
    const getReview = async () => {
      console.log("!:", request.isReviewed);
      if (!request.isReviewed) return;
      console.log("QQ");
      try {
        const response: { data: { message: string; rating: number } } =
          await axios.get(`${apiUrl}/reviews/${request.requestid}`);

        console.log("resp: ", response);
        setReviewMessage(response.data.message);
        setRated(response.data.rating);
      } catch (error) {
        console.error(error);
      }
    };

    getReview();
  }, []);

  if (state) {
    // `state` exists, you can safely destructure it
    ({ request, celeb } = state);

    // Rest of your code
  } else {
    return;
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

  console.log("isREV: ", request);

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
              isReviewed={request.isReviewed}
              reviewMessage={reviewMessage}
              setReviewMessage={setReviewMessage}
              rated={rated}
              setRated={setRated}
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
        {
          <button
            onClick={() => setOpenModal(true)}
            className=" border border-gray-600 w-2/4 py-4 rounded-lg hover:bg-[#37313d] "
          >
            {!request.isReviewed ? "Leave a Review" : "Edit Review"}
          </button>
        }
      </div>
    </div>
  );
}

export default FulFilled;
