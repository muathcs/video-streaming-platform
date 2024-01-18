import { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { useNavigate } from "react-router-dom";
import Success from "./Success";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [message, setMessage] = useState<string | null>(null);

  const [request] = useLocalStorage("request");

  const { data: sendRequest }: any = useGlobalAxios("post", "request"); //

  useEffect(() => {
    if (!stripe) {
      return;
    }

    console.log("req: ", window.location.search);

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret: any = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

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
          console.log("here");
          navigate("/success");
          setMessage("success");
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

  return <>{message == "success" ? <Success /> : null}</>;
};

export default PaymentStatus;
