import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

type fanRequests = {
  message: string;
};
function Dashboard() {
  const { currentUser }: any = useAuth();

  const [requests, setRequests] = useState<fanRequests[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("requesitng");
      try {
        const response = await axios.get("http://localhost:3001/dashboard", {
          params: { uid: currentUser.uid },
        });

        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchRequests();
  }, []);
  return (
    <div>
      <h1>Hello</h1>
      {requests.map((req) => (
        <>
          <h1>{req.message}</h1>
        </>
      ))}
    </div>
  );
}

export default Dashboard;
