import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
// call loadStripe outside of a componenet render, so you odn't recrete the Stripe object on every render
import { apiUrl } from "../utilities/fetchPath";

const stripePromise = loadStripe(
  "pk_test_51LJDOjGFwRQBDdF4mK0dnR99AbxVar1HyeMsbYUN4HDWWC44f29yhYiOCArdEv3T7yQ5JNZF1QbbmzUWXqjywMPQ00RtVGGAFq"
);
function StripePaymentIntent() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads

    const sendRequest = async () => {
      fetch(`${apiUrl}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    };

    sendRequest();
  }, []);

  console.log("cls: ", clientSecret);

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
