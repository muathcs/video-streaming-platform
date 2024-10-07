import { useAuth } from "../context/AuthContext";
import completePic from "../assets/complete.png";
import { MdOutlinePendingActions } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsQuestionCircle, BsChevronDown, BsChevronUp } from "react-icons/bs";
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
    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Request Rejected</h3>
          <p className="text-gray-300 mb-4">
            {celebName} has rejected your request. This may be due to the content of your request or a personal decision. You have received a full refund.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function FanRequestContainer({ request, celeb }: FanRequestContainerProp) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { reqstatus } = request;
  const { displayname: celebName, imgurl: celebPhoto } = celeb ?? {};
  const navigate = useNavigate();
  const { currentUser }: any = useAuth();

  const timestamp = request.timestamp1;
  const date = new Date(timestamp);
  date.setDate(date.getDate() + 7);
  const requestDeliveryDate = date.toISOString().split("T")[0];

  const handleCardClick = () => {
    navigate(`/profile/${celeb.displayname}/${celeb.uid}`, { state: { celeb } });
  };

  const renderRequestStatus = () => {
    switch (reqstatus) {
      case "fulfilled":
        return (
          <div className="flex flex-col items-center">
            <img src={completePic} alt="Completed" className="w-16 h-16 mb-2" />
            <button
              onClick={() => navigate("/request/fulfilled", { state: { request, celeb } })}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              View Response
            </button>
          </div>
        );
      case "pending":
        return (
          <div className="flex flex-col items-center">
            <MdOutlinePendingActions className="text-5xl text-yellow-500 mb-2" />
            <span className="text-sm text-gray-300">Expected: {requestDeliveryDate}</span>
          </div>
        );
      case "rejected":
        return (
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center text-red-500 hover:text-red-400"
          >
            <span className="mr-2">Request Rejected</span>
            <BsQuestionCircle size={20} />
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <RejectedRequestModalMessage celebName={celebName} setOpenModal={setOpenModal} />
      </Modal>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 p-4">
            <img
              onClick={handleCardClick}
              className="w-full h-48 object-cover rounded-lg cursor-pointer"
              src={currentUser && celebPhoto}
              alt={celebName}
            />
          </div>
          <div className="md:w-2/3 p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{celebName}</h2>
              <p className="text-gray-400 mb-2">Request Type: {request.reqtype}</p>
              <p className="text-gray-400 mb-4">Action: {request.reqaction}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Requested on: {new Date(request.timestamp1).toLocaleDateString()}</span>
              {renderRequestStatus()}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-gray-300 hover:text-white"
          >
            <span>View Request Details</span>
            {expanded ? <BsChevronUp /> : <BsChevronDown />}
          </button>
          {expanded && (
            <div className="mt-4 text-gray-300">
              <h3 className="font-semibold mb-2">Your Message:</h3>
              <p className="bg-gray-800 p-3 rounded-lg">{request.message}</p>
              {request.celebmessage && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Celebrity's Response:</h3>
                  <p className="bg-gray-700 p-3 rounded-lg">{request.celebmessage}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FanRequestContainer;
