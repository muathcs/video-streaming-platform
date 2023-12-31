import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
import axios from "../api/axios";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useGlobalDataFetch } from "../hooks/useGlobalDataFetch";
import { useGlobalAxios } from "../hooks/useGlobalAxios";

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

  const { data, loading, error } = useGlobalAxios(
    "get",
    "http://localhost:3001/fanrequests",
    currentUser.uid
  );

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        <div className="  overflow-auto flex flex-col gap-2">
          {data &&
            data.map((req: requestType, index: number) => (
              <FanRequestContainer
                key={uuidv4()}
                message={req.request.message}
                reqtype={req.request.reqtype}
                requestaction={req.request.reqaction}
                timestamp1={req.request.timestamp1}
                requeststatus={req.request.reqstatus}
                requestid={req.request.requestid}
                celebmessage={req.request.celebmessage}
                celebName={req.celeb.displayname}
                celebPhoto={req.celeb.imgurl}
              />
            ))}
        </div>
      )}
    </>
  );
}

export default FanRequests;
