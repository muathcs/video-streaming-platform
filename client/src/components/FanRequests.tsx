import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "./FanRequestContainer";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
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

  useEffect(() => {
    console.log("user: ", currentUser.uid);
    const getCelebEplies = async () => {
      try {
        const response = await axios.get(`${apiUrl}/fanrequests`, {
          params: { uid: currentUser.uid },
        });
        console.log("da: ", response.data);

        setCelebReplies(response.data);
      } catch (error: any) {
        console.error(error);
      }
    };

    getCelebEplies();
  }, []);

  // const { data, loading, error } = useGlobalAxios<fanRequestType[]>(
  //   "get",
  //   `${apiUrl}/fanrequests`,
  //   currentUser.uid
  // );

  // console.log("data: ", data);

  return (
    <>
      {0 ? (
        <h1>Loading</h1>
      ) : 0 ? (
        <h1>Error</h1>
      ) : (
        <div className="  overflow-auto flex flex-col gap-2">
          <>
            {celebReplies &&
              celebReplies.map((req: fanRequestType, index: number) => (
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
