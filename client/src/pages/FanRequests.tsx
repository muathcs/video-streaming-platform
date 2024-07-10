import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "../components/FanRequestContainer";
import { RequestType } from "../TsTypes/types";
import { CelebType } from "../TsTypes/types";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";

//this component has the various requests a user has made to diff celebs, and the status of those requestS(fulfilled or pending.)
// if a request is fulfilled, the user can click the view button, which will display the FulFilled componenet.
type fanRequestType = {
  celeb: CelebType;
  request: RequestType;
};
function FanRequests() {
  const { currentUser }: any = useAuth();
  const [celebReplies, setCelebReplies] = useState<fanRequestType[]>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const getCelebEplies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/request/fanrequests`, {
          params: { uid: currentUser.uid },
        });
        setLoading(false);

        setCelebReplies(response.data);
        console.log("equal: ", response.data.length === 0);
        console.log("rez: ", response.data);
      } catch (error: any) {
        console.error(error);
        setError(true);
      }
    };

    getCelebEplies();
  }, []);

  return (
    <>
      {loading ? (
        <h1 className="">Loading</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        <div className="overflow-auto flex flex-col gap-2 h-full   ">
          <>
            {celebReplies?.length === 0 ? (
              <h1 className=" top-40 relative">You do not have any requests</h1>
            ) : (
              ""
            )}
            {celebReplies &&
              celebReplies.map((req: fanRequestType) => (
                <>
                  {/* each one of these componenets hold a request */}
                  <FanRequestContainer
                    request={req.request}
                    celeb={req.celeb}
                    key={req.request.requestid}
                  />
                </>
              ))}
          </>
        </div>
      )}
    </>
  );
}

export default FanRequests;
