import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentStatus from "../pages/PaymentStatus";

const PaymentStatusWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("inside wrapper");

  useEffect(() => {
    // Check if the location.pathname is "/paymentstatus"
    if (location.pathname === "/paymentstatus") {
      // Extract query parameters from the URL
      const queryParams = new URLSearchParams(location.search);
      const paymentIntent = queryParams.get("payment_intent");
      const clientSecret = queryParams.get("payment_intent_client_secret");
      const redirectStatus = queryParams.get("redirect_status");

      // Modify the URL as needed
      const updatedURL = `/paymentstatus?payment_intent=${paymentIntent}&payment_intent_client_secret=${clientSecret}&redirect_status=${redirectStatus}`;

      console.log("updatedURL: ", updatedURL);

      // Use replace instead of push to update the URL without adding a new entry to the history stack
      navigate(updatedURL, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  // Render your PaymentStatus component
  return <PaymentStatus />;
};

export default PaymentStatusWrapper;
