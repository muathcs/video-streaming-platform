import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
// call loadStripe outside of a componenet render, so you odn't recrete the Stripe object on every render
import { apiUrl } from "../utilities/fetchPath";
import axios from "../api/axios";

const stripePromise = loadStripe(
  "pk_test_51LJDOjGFwRQBDdF4XITXzBVWxK72genu1MHAFxH6KOjUXzUq8eKqfe6mtTOU5GSFXJ8O7GJEO5wr1QC1ALZcsobz00DES41OcW"
);

type StripePaymentIntentProp = {
  requestPrice: number;
  celebUid: string;
  fanUid: string;
  email: string;
};
function StripePaymentIntent({
  requestPrice,
  celebUid,
  fanUid,
  email,
}: StripePaymentIntentProp) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads

    //make a request to get the celebs payment

    const sendRequest = async () => {
      const response = await axios.post(
        `${apiUrl}/stripe/create-payment-intent`,
        {
          requestPrice,
          fanUid,
          celebUid,
          email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setClientSecret(response.data.clientSecret);
      // fetch(`${apiUrl}/stripe/create-payment-intent`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     requestPrice,
      //     fanUid,
      //     celebUid,
      //   }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setClientSecret(data.clientSecret);
      //   });
    };

    sendRequest();
  }, []);

  const appearance = {
    theme: "night",
    variables: {
      colorText: "#ffffff",
      borderRadius: "5px",
      height: "0px",
      padding: "0px",
      margin: "0px",
      //   spacingUnit: "3px",
    },
  };

  const expressCheckoutOptions = {
    buttonType: {
      applePay: "buy",
      googlePay: "buy",
      paypal: "buynow",
    },
  };

  const options: any = {
    clientSecret,
    appearance,
    expressCheckoutOptions,
  };

  return (
    <div className="">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default StripePaymentIntent;
