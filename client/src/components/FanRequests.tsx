import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
import { RequestType } from "../TsTypes/types";
import { CelebType } from "../TsTypes/types";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";

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
        const response = await axios.get(`${apiUrl}/fanrequests`, {
          params: { uid: currentUser.uid },
        });
        setLoading(false);

        setCelebReplies(response.data);
      } catch (error: any) {
        console.error(error);
        setError(true);
      }
    };

    getCelebEplies();
  }, []);

  // const { data, loading, error } = useGlobalAxios<fanRequestType[]>(
  //   "get",
  //   `${apiUrl}/fanrequests`,
  //   currentUser.uid
  // );

  return (
    <>
      {loading ? (
        <h1 className="">Loading</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        <div className="  overflow-auto flex flex-col gap-2  h-full">
          <>
            {celebReplies &&
              celebReplies.map((req: fanRequestType) => (
                <>
                  {/* FanRequestContainer holds the requests, the FulFilled contianer holds the viewed requests.   */}
                  <>
                    <FanRequestContainer
                      request={req.request}
                      celeb={req.celeb}
                      key={req.request.requestid}
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
