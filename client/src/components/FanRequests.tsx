import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
type requestType = {
  request: {
    message: string;
    req_type: string;
    requestAction: string;
    timestamp1: string;
    requeststatus: string;
    celebmessage: string;
    requestid: string;
  };
  celeb: {
    uid: string;
    displayname: string;
    imgurl: string;
  };
};
function FanRequests() {
  const { currentUser }: any = useAuth();

  const [requests, setRequests] = useState<requestType[]>([]);

  console.log("req: ", requests[0]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3001/fanrequests", {
          params: { uid: currentUser.uid },
        });

        setRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getRequests();
  }, []);
  return (
    <>
      <div className="  overflow-auto flex flex-col gap-2">
        {requests.map((req, index) => (
          <FanRequestContainer
            key={uuidv4()}
            message={req.request.message}
            reqType={req.request.req_type}
            requestaction={req.request.requestAction}
            timestamp1={req.request.timestamp1}
            requeststatus={req.request.requeststatus}
            requestid={req.request.requestid}
            celebmessage={req.request.celebmessage}
            celebName={req.celeb.displayname}
            celebPhoto={req.celeb.imgurl}
          />
        ))}
      </div>
    </>
  );
}

export default FanRequests;
