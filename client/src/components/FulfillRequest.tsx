import React, { useEffect } from "react";
import axios from "../api/axios";
import { useLocation, useParams } from "react-router-dom";

function FulfillRequest() {
  const { requestId } = useParams();

  const { state } = useLocation();

  console.log("statex: ", state);
  useEffect(() => {
    const fulfillReq = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/fulfill/${requestId}`,
          {
            params: { f: "val" },
          }
        );

        console.log("response", response);
      } catch (error) {
        console.error(error);
      }
    };

    fulfillReq();
  }, []);
  return (
    <div>
      <h1>Fulfill</h1>

      <p>{state.fromperson}</p>
      <p>to: {state.toperson}</p>
      <p>message: {state.message}</p>
      <p>message: </p>
    </div>
  );
}

export default FulfillRequest;
