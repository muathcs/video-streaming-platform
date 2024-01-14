import {
  ElementsConsumer,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
  AddressElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { Layout } from "@stripe/stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RequestContext } from "../context/RequestContext";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // custom to hook to get, post and put.
  // data is the function.

  const {
    data: sendUserRequestForm,
    loading,
    error,
  } = useGlobalAxios("post", "yourDataEndpoint");

  const { request } = useContext(RequestContext);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          sendUserRequestForm("request", request);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const state = useLocation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/paymentstatus",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: true,
    },
    variables: {
      borderRadius: "5px",
      padding: "0px",
      margin: "0px",
    },
    autoFocus: false,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      {/* <CardElement id="payment-element" options={paymentElementOptions} /> */}
      {/* <AddressElement options={paymentElementOptions} mode="shipping" /> */}
      {/* <CardNumberElement options={paymentElementOptions} /> */}
      {/* <CardExpiryElement options={paymentElementOptions} /> */}
      {/* <CardCvcElement id="payment-element" options={paymentElementOptions} /> */}
      {!isLoading && stripe && elements && (
        <button
          disabled={isLoading || !stripe || !elements}
          className="bg-blue-400 rounded-lg py-4 px-10 mt-5 "
          id="submit"
        >
          <span className="" id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
      )}
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

// export default function InjectedCheckoutForm() {
//   return (
//     <ElementsConsumer>
//       {({ stripe, elements }) => (
//         <CheckoutForm stripe={stripe} elements={elements} />
//       )}
//     </ElementsConsumer>
//   );
// }
