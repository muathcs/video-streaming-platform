import { useState } from "react";
import StripePaymentIntent from "../components/StripePaymentIntent";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextType, RequestType } from "../TsTypes/types";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type LocationStateType = {
  fanUid: string;
  celebUid: string;
  price: number;
};
function Payment() {
  const [paymentChoice, setPaymentChoice] = useState<string>("");
  const { currentUser }: AuthContextType = useAuth();
  const [state] = useLocalStorage<LocationStateType>("request");

  console.log("local: ", state);

  // const { state }: LocationStateType = useLocation();

  console.log("state: ", currentUser.email);

  const divStyle =
    " border-2 h-24 w-full rounded-xl  peer-checked:shadow-blue-200 peer-checked:border-blue-600  cursor-pointer flex items-center justify-between ";

  return (
    <>
      <div className="w-full h-full   overflow-auto  ">
        <div className="h-full w-full relative grid grid-cols-1   grid-rows-6  overflow-auto   justify-items-center   ">
          {/* <!-- Email input --> */}
          <div
            className="relative    0 w-1/3 row-span-1.5  flex  "
            data-te-input-wrapper-init
          >
            <div className="gap-4 text-center sm:grid-cols-3  flex flex-col justify-center items-center  w-full my-2">
              <p className="text-left w-full font-serif text-lg font-bold">
                Delivery Speed
              </p>

              <div className=" w-full">
                <input
                  className="peer sr-only  w-full"
                  id="option1"
                  type="radio"
                  name="delivery"
                  // onClick={() => setTwentyFourHourDelivery(0)}
                  defaultChecked
                />

                <label htmlFor="option1" className={divStyle}>
                  <div className="ml-5 ">
                    <p className="text-left">Standard</p>
                    <p>up to 7 days</p>
                  </div>
                  <p className="mr-5">Free</p>
                </label>
              </div>
            </div>
          </div>

          {/* <!-- Payment method --> */}
          <div
            className="relative  mb-6  overflow-hidden w-1/3 row-span-3 h-[65rem]   "
            data-te-input-wrapper-init
          >
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

              {/* //order detail
              // personalise video <----> price
              // Service Fee <-----> price
              // Sales Tax <---> free
              //Total ---> total */}

              <div className=" text-left flex flex-col border-t mt-10 text-lg gap-2 border-gray-600">
                <p>Order detail</p>
                <div className=" flex justify-between px-3">
                  <p>Personalised Video</p>
                  <p>£{state.price}.00</p>
                </div>

                <span className="border-b  border-gray-600"></span>
                <div className=" flex justify-between px-3">
                  <p>Service Fee </p>
                  <p>£23.00</p>
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
                  <p>£{state.price}.00</p>
                </div>
              </div>

              <div className=" p-5 h-76 ">
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

          {/* continue */}

          {/* <div className=" border-blue-400 flex justify-center items-start  w-1/3 row-span-1">
            <button className="block w-1/2 rounded-full border  border-gray-200 py-5 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white">
              Continue
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Payment;
