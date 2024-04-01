import { useAuth } from "../context/AuthContext";
import completePic from "../assets/complete.png";
import { MdOutlinePendingActions } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BsQuestionCircle } from "react-icons/bs";

import { rejects } from "assert";
import { useState } from "react";
import Modal from "./Modal";
import { bool } from "aws-sdk/clients/signer";

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
}

function FulfilledRequest({ request, celeb }: FanRequestContainerProp) {
  const navigate = useNavigate();
  return (
    <>
      <img
        src={completePic}
        width={100}
        className=" absolute bottom-32 right-5"
      />

      {/* if the request is fullfilled */}
      <button
        onClick={() =>
          navigate("/request/fulfilled", {
            state: { request, celeb },
          })
        }
        className=" absolute bottom-5 right-2 px-10 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        View
      </button>
    </>
  );
}

//this component has the various requests a user has made to diff celebs, and the status of those requestS(fulfilled, pending  or rejected.)
// if a request is fulfilled, the user can click the view button, which will display the FulFilled componenet.
function FanRequestContainer({ request, celeb }: FanRequestContainerProp) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { reqstatus } = request;

  console.log("reqhere: ", request);

  const { displayname: celebName, imgurl: celebPhoto } = celeb ?? {};
  const navigate = useNavigate();

  const { currentUser }: any = useAuth();

  const timestamp = request.timestamp1;
  const date = new Date(timestamp);
  // Add 7 days to the date
  date.setDate(date.getDate() + 7);
  // Format the new date as a string
  const requestDeliveryDate = date.toISOString().split("T")[0];

  const handleCardClick = () => {
    // Pass information about the clicked celeb as state
    navigate("/profile", {
      state: { celeb },
    });
  };

  return (
    <div className=" cursor-pointer w-full flex justify-center items-center mt-10   ">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <div className="flex flex-col p-8  bg-gray-800 w-full  h-full shadow-md hover:shodow-lg rounded-2xl ">
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 rounded-2xl p-3 border border-gray-800 text-red-400 bg-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div className="flex flex-col ml-3">
                <div className="font-medium text-lg leading-none text-gray-100">
                  {celebName} has rejected your request
                </div>
                <p className="text-md text-gray-500 leading-none mt-1">
                  this may be due to the content of your request, or a personal
                  decision. You have recieved a full refund.
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpenModal(false)}
              className="flex-no-shrink bg-red-500 hover:bg-red-600 px-5 ml-4 py-2 rounded-full"
            >
              close
            </button>
          </div>
        </div>
      </Modal>
      <div className="relative flex p-5 flex-col items-center   md:flex-row    md:w-1/2 rounded-lg  shadow-lg shadow-black border border-gray-600 ">
        <div className=" w-1/3 h-[350px]  ">
          <img
            onClick={handleCardClick}
            className="rounded-lg border w-full h-full object-cover relative   border-gray-600 "
            src={currentUser && celebPhoto}
            alt=""
          />
        </div>
        <div>
          <div className=" h-[250px] ml-5 ">
            <p className="   text-lg wotfard  flex items-center gap-2  ">
              Your Request to {celebName} is {reqstatus}
              {reqstatus == "rejected" ? (
                <span
                  onClick={() => setOpenModal(true)}
                  className="text-[20px] text-white "
                >
                  <BsQuestionCircle />{" "}
                </span>
              ) : null}
            </p>
            <span className=" absolute bottom-0 right-0 w-1/2 h-1/2 ">
              {reqstatus == "fulfilled" ? (
                <FulfilledRequest request={request} celeb={celeb} />
              ) : reqstatus == "pending" ? (
                <>
                  <span className="absolute bottom-32 right-6 text-[5rem] ">
                    <MdOutlinePendingActions width="33" />
                  </span>
                  <span className="absolute bottom-5 right-2 px-10 py-3 bg-blue-500 rounded-lg ">
                    Expected: {requestDeliveryDate}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
