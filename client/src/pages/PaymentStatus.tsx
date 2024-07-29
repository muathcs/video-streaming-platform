import { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import Success from "../components/Success";
import { apiUrl } from "../utilities/fetchPath";
import { RequestType } from "../TsTypes/types";
const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState<string | null>(null);

  const [request] = useLocalStorage<RequestType>("request");

  const { data: sendPostRequest } = useGlobalAxios("post");
  const [requestProcessed, setRequestProcessed] = useLocalStorage<boolean>(
    "requestProcessed",
    false
  );

  function createNotification() {
    sendPostRequest(`${apiUrl}/notification`, {
      intended_uid: request.celebUid,
      sender_uid: request.fanUid,
      message: "user has made a request",
    });
  }

  const { data: sendRequest }: any = useGlobalAxios("post", "request"); //

  useEffect(() => {
    if (!stripe) {
      return;
    }

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
          console.log("paymenIntent: ");
          sendRequest("request", request);
          // sendRequest("request", request).then(() => {
          //   setRequestProcessed(true); // Set the flag to true after the request is processed
          // });
          console.log("sucess", request);
          // createNotification();
          // navigate("/success", request); // we will send the request to the success page, where we will create a notification for the celeb
          setMessage("success");
          console.log("message set to success");
          break;

        case "processing":
          setMessage(
            "Payment processing. We'll update you when payment is received."
          );
          console.log("processing...");
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage("Payment failed. Please try another payment method.");
          console.log("require payment");
          break;

        default:
          console.log("defualt...");
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, requestProcessed]);

  return (
    <>
      {message == "success" ? (
        <Success celebUid={request.celebUid} price={request.price} />
      ) : null}
    </>
  );
};

export default PaymentStatus;
