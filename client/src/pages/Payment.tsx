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
      <div className="w-full flex justify-center pt-10 bg-black  ">
        {/* <!-- Payment method --> */}
        <div className="relative w-1/3     " data-te-input-wrapper-init>
          <p className="text-left text-lg font-bold font-serif   ">
            Payment method
          </p>
          <div className="gap-4 flex flex-col text-center my-2  relative ">
            {/* <StripePaymentIntent /> */}
            <div className=" w-full">
              <input
                className="peer sr-only  w-full"
                id="option3"
                type="radio"
                name="remote"
                onClick={() => setPaymentChoice("card")}
                // onClick={(e) => setToSomeOneElse(true)}

                //   onClick={(e) =>
                //     setFormData({ ...formData, toSomeOneElse: true })
                //   }
              />

              <label htmlFor="option3" className={divStyle}>
                <p className="ml-5">Pay by Card</p>
              </label>
            </div>

            <div className="w-full">
              <input
                className="peer sr-only"
                id="option4"
                type="radio"
                name="remote"
                onClick={() => setPaymentChoice("PayPal")}
              />

              <label htmlFor="option4" className={divStyle}>
                <p className="text-left ml-5">Pay Pal</p>
              </label>
            </div>
            <div className="w-full">
              <input
                className="peer sr-only"
                id="option5"
                type="radio"
                name="remote"
              />

              <label htmlFor="option5" className={divStyle}>
                <p className="text-left ml-5">Google</p>
              </label>
            </div>

            {/* Reciept */}
            <div className=" text-left flex flex-col border-t mt-10 text-lg gap-2 border-gray-600">
              <p>Order detail</p>
              <div className=" flex justify-between px-3">
                <p>Personalised Video</p>
                <p>{formatter.format(state.price)}</p>
              </div>

              <span className="border-b  border-gray-600"></span>
              <div className=" flex justify-between px-3">
                <p>Service Fee </p>
                <p>{formatter.format(state.price * 0.1)}</p>
              </div>
              <div className=" flex justify-between px-3">
                <p>Sales Tax </p>
                <p>free</p>
              </div>
              <span className="border-b  border-gray-600"></span>
              {/* <div className=" flex justify-between px-3">
                  <a className="text-white underline hover:text-white cursor-pointer">
                    Add Promo Code
                  </a>
                </div> */}
              <span className="border-b  border-gray-600"></span>
              <div className=" flex justify-between px-3">
                <p>Total</p>
                <p>{formatter.format(state.price + state.price * 0.1)}</p>
              </div>
            </div>

            <div className="  ">
              {paymentChoice == "card" ? (
                <div>
                  <StripePaymentIntent
                    requestPrice={state.price}
                    celebUid={state.celebUid}
                    fanUid={state.fanUid}
                    email={currentUser.email}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
