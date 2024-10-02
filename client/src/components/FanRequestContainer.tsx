import { useAuth } from "../context/AuthContext";
import completePic from "../assets/complete.png";
import { MdOutlinePendingActions } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsQuestionCircle } from "react-icons/bs";

import { Dispatch, SetStateAction, useState } from "react";
import Modal from "./Modal";

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

function RejectedRequestModalMessage({
  celebName,
  setOpenModal,
}: {
  celebName: string;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  return (
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
  );
}

//this component has the various requests a user has made to diff celebs, and the status of those requestS(fulfilled, pending  or rejected.)
// if a request is fulfilled, the user can click the view button, which will display the FulFilled componenet.
function FanRequestContainer({ request, celeb }: FanRequestContainerProp) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { reqstatus } = request;

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
    navigate(`/profile/${celeb.displayname}/${celeb.uid}`, {
      state: { celeb },
    });
  };

  const renderRequestStatus = () => {
    if (reqstatus === "fulfilled") {
      return (
        <>
          <img
            src={completePic}
            width={100}
            className="absolute bottom-32 right-5"
          />
          <button
            onClick={() =>
              navigate("/request/fulfilled", {
                state: { request, celeb },
              })
            }
            className="absolute bottom-5 right-2 px-10 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            View
          </button>
        </>
      );
    }

    if (reqstatus === "pending") {
      return (
        <>
          <span className="absolute bottom-32 right-6 text-[5rem]">
            <MdOutlinePendingActions />
          </span>
          <span className="absolute bottom-5 right-2 px-10 py-3 bg-blue-500 rounded-lg">
            Expected: {requestDeliveryDate}
          </span>
        </>
      );
    }

    if (reqstatus === "rejected") {
      return (
        <span
          onClick={() => setOpenModal(true)}
          className="text-lg flex items-center gap-2  absolute top-5 right-2"
        >
          Your Request to {celebName} is {reqstatus}
          <BsQuestionCircle size={24} />
        </span>
      );
    }

    return null;
  };

  return (
    <div className="cursor-pointer w-full flex justify-center items-center mt-10 ">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <RejectedRequestModalMessage
          celebName={celebName}
          setOpenModal={setOpenModal}
        />
      </Modal>
      <div className="relative flex p-5 flex-col items-center md:flex-row lg:w-1/2 sm:w-2/3 w-full  rounded-lg shadow-lg shadow-black border border-gray-600">
        <div className="md:w-1/3 w-2/3 h-[350px]">
          <img
            onClick={handleCardClick}
            className="rounded-lg border w-full h-full object-cover relative border-gray-600"
            src={currentUser && celebPhoto}
            alt={celebName}
          />
        </div>
        <div className="h-[250px] ml-5">
          <span className="absolute bottom-0 right-0 w-1/2 h-full ">
            {renderRequestStatus()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
