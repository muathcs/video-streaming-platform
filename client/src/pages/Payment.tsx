import { useState } from "react";
import StripePaymentIntent from "../components/StripePaymentIntent";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextType, RequestType } from "../TsTypes/types";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatter } from "@/utilities/currencyFormatter";

type LocationStateType = {
  fanUid: string;
  celebUid: string;
  price: number;
};
function Payment() {
  const [paymentChoice, setPaymentChoice] = useState<string>("");
  const { currentUser }: AuthContextType = useAuth();
  const [state] = useLocalStorage<LocationStateType>("request");

  console.log("SRE: ", state);
  const divStyle =
    " border-2 h-24 w-full rounded-xl  peer-checked:shadow-blue-200 peer-checked:border-blue-600  cursor-pointer flex items-center justify-between ";

  return (
    <>
      <div className="w-full min-h-screen bg-black text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Payment</h1>
          
          {/* Payment method selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment method</h2>
            <div className="space-y-4">
              {['card', 'PayPal', 'Google'].map((method) => (
                <div key={method} className="relative">
                  <input
                    id={`payment-${method}`}
                    type="radio"
                    name="payment"
                    value={method}
                    className="peer sr-only"
                    onChange={() => setPaymentChoice(method)}
                  />
                  <label
                    htmlFor={`payment-${method}`}
                    className="flex items-center p-4 border border-gray-800 rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-800 peer-checked:border peer-checked:border-[#3f3b45] peer-checked:bg-[#201e23]"
                  >
                    <span className="ml-3 font-medium">
                      Pay with {method.charAt(0).toUpperCase() + method.slice(1)}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Order details */}
          <div className="border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Personalised Video</span>
                <span>{formatter.format(state.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{formatter.format(state.price * 0.1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatter.format(state.price + state.price * 0.1)}</span>
              </div>
            </div>
          </div>

          {/* Payment form */}
          {paymentChoice === "card" && (
            <div className="border border-gray-800 rounded-lg p-6">
              <StripePaymentIntent
                requestPrice={state.price}
                celebUid={state.celebUid}
                fanUid={state.fanUid}
                email={currentUser.email}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Payment;
