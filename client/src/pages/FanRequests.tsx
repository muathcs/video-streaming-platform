import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import FanRequestContainer from "../components/FanRequestContainer";
import { RequestType, CelebType, AuthContextType } from "../TsTypes/types";
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";
import FanRequestSkeleton from "@/components/loadingSkeletons/FanRequestSkeleton";

type FanRequestType = {
  celeb: CelebType;
  request: RequestType;
};

function FanRequests() {
  const { currentUser }: AuthContextType = useAuth(); // Assume this has a defined type
  const [fanRequests, setFanRequests] = useState<FanRequestType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getFanRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/request/fanrequests`, {
        params: { uid: currentUser.uid },
      });
      setFanRequests(response.data);
    } catch (error: any) {
      console.error(error);
      setError("Failed to fetch requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFanRequests();
  }, []);

  if (loading) {
    return (
      <div className="overflow-auto flex flex-col gap-2 h-full items-center pt-10 bg-black">
        <FanRequestSkeleton />
        <FanRequestSkeleton />
        <FanRequestSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div className="overflow-auto flex flex-col gap-2 h-full bg-black justify-start items-center pb-20">
      {fanRequests.length === 0 ? (
        <h1 className="top-40 relative">You do not have any requests</h1>
      ) : (
        fanRequests.map((req: FanRequestType) => (
          <FanRequestContainer
            request={req.request}
            celeb={req.celeb}
            key={req.request.requestid}
          />
        ))
      )}
    </div>
  );
}

export default FanRequests;
