import { useAuth } from "../context/AuthContext";
import completePic from "../assets/complete.png";
import { MdOutlinePendingActions } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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

//this component has the various requests a user has made to diff celebs, and the status of those requestS(fulfilled or pending.)
// if a request is fulfilled, the user can click the view button, which will display the FulFilled componenet.
function FanRequestContainer({ request, celeb }: FanRequestContainerProp) {
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

  return (
    <div className=" cursor-pointer w-full flex justify-center items-center mt-10   ">
      <div className="relative flex p-5 flex-col items-center   md:flex-row    md:w-1/2 rounded-lg  shadow-lg shadow-black border border-gray-600 ">
        <div className=" w-1/3 h-[350px]  ">
          <img
            className="rounded-lg border w-full h-full object-cover relative   border-gray-600 "
            src={currentUser && celebPhoto}
            alt=""
          />
        </div>
        <div>
          <div className=" h-[250px] ml-5 ">
            <p className="   text-lg wotfard ">
              Your Request to {celebName} is {reqstatus}
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
