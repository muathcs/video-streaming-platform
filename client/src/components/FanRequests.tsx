import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGlobalDataFetch } from "../hooks/useGlobalDataFetch";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import FulFilled from "./fulfillRequest/FulFilled";

type requestType = {
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
};
function FanRequests() {
  const { currentUser }: any = useAuth();
  const [viewFulfilled, setViewFulfilled] = useState<string | null>("");

  const { data, loading, error } = useGlobalAxios(
    "get",
    "http://localhost:3001/fanrequests",
    currentUser.uid
  );

  console.log("data here: ", data);

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        <div className="  overflow-auto flex flex-col gap-2">
          <>
            {data &&
              data.map((req: requestType, index: number) => (
                <>
                  {!viewFulfilled ? (
                    <FanRequestContainer
                      request={req.request}
                      celeb={req.celeb}
                      setViewFulfilled={setViewFulfilled}
                    />
                  ) : (
                    viewFulfilled === req.request.requestid && (
                      <FulFilled
                        request={req.request}
                        celeb={req.celeb}
                        setViewFulfilled={setViewFulfilled}
                      />
                    )
                  )}
                </>
              ))}
          </>
        </div>
      )}
    </>
  );
}

export default FanRequests;
