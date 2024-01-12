import React, { useState, useEffect, useContext } from "react";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { RequestContext } from "../context/RequestContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useGlobalAxios } from "../hooks/useGlobalAxios";

const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState<string | null>(null);
  const stripePromise = loadStripe(
    "pk_test_51LJDOjGFwRQBDdF4mK0dnR99AbxVar1HyeMsbYUN4HDWWC44f29yhYiOCArdEv3T7yQ5JNZF1QbbmzUWXqjywMPQ00RtVGGAFq"
  );

  const [request] = useLocalStorage("request");

  const {
    data: sendRequest,
    loading,
    error,
  }: any = useGlobalAxios("post", "request");

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret: any = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent?.status) {
        case "succeeded":
          sendRequest("request", request);
          setMessage("Success! Payment received.");
          break;

        case "processing":
          setMessage(
            "Payment processing. We'll update you when payment is received."
          );
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage("Payment failed. Please try another payment method.");
          break;

        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  return <>{message}</>;
};

export default PaymentStatus;
