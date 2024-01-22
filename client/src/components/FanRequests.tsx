import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
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
          <>
            {data &&
              data.map((req: requestType, index: number) => (
                <>
                  {/* FanRequestContainer holds the requests, the FulFilled contianer holds the viewed requests.   */}
                  <>
                    <FanRequestContainer
                      request={req.request}
                      celeb={req.celeb}
                      key={index}
                    />
                  </>
                </>
              ))}
          </>
        </div>
      )}
    </>
  );
}

export default FanRequests;
