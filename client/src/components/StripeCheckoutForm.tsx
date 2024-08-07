import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { RequestContext } from "../context/RequestContext";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { apiUrl } from "../utilities/fetchPath";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function StripeCheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const currentUrl = window.location.origin;

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [request] = useLocalStorage("request");

  // custom to hook to get, post and put.
  // data is the function.

  const { data: sendUserRequestForm } = useGlobalAxios(
    "post",
    "yourDataEndpoint"
  );

  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
        return_url: `${window.location.origin}/paymentstatus`,
      },
      // redirect: "if_required",
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

  const notify = () => {
    toast("🦄 Payment processing, please wait", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (isLoading) {
      notify(); // Show the toast when loading is true
    } else {
      toast.dismiss(); // Hide the toast when loading becomes false
    }
  }, [isLoading]);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ width: "500px", height: "5100px", marginTop: 100 }}
      />
      <div id="payment-form">
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        {/* <CardElement id="payment-element" options={paymentElementOptions} /> */}
        {/* <AddressElement options={paymentElementOptions} mode="shipping" /> */}
        {/* <CardNumberElement options={paymentElementOptions} /> */}
        {/* <CardExpiryElement options={paymentElementOptions} /> */}
        {/* <CardCvcElement id="payment-element" options={paymentElementOptions} /> */}
        {!isLoading && stripe && elements && (
          <button
            disabled={isLoading || !stripe || !elements}
            onClick={(e) => handleSubmit(e)}
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
      </div>
    </>
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
