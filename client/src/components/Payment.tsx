import React, { useState } from "react";
import { useFormik } from "formik";
import StripePaymentIntent from "./StripePaymentIntent";
import { useLocation } from "react-router-dom";
function Payment() {
  const [delivery, setDelivery] = useState();

  const [paymentChoice, setPaymentChoice] = useState<string>("");

  console.log(paymentChoice);

  const hadnleSubmit = () => {
    console.log("submitting");
  };

  const divStyle =
    " border-2 h-24 w-full rounded-xl  peer-checked:shadow-blue-200 peer-checked:border-blue-600  cursor-pointer flex items-center justify-between ";

  return (
    <>
      <div className="w-full h-full   overflow-auto  ">
        <div className="h-full w-full relative grid grid-cols-1 grid-rows-7 overflow-auto  mt-10 place-items-center gap-44">
          {/* <!-- Email input --> */}
          <div
            className="relative  mb-6  0 w-1/3 row-span-3 "
            data-te-input-wrapper-init
          >
            <div className="gap-4 text-center sm:grid-cols-3  flex flex-col justify-center items-center  my-2">
              <p className="text-left w-full font-serif text-lg font-bold">
                Delivery Speed
              </p>

              <div className=" w-full">
                <input
                  className="peer sr-only  w-full"
                  id="option1"
                  type="radio"
                  name="delivery"
                  // onClick={(e) => setToSomeOneElse(true)}

                  //   onClick={(e) =>
                  //     setFormData({ ...formData, toSomeOneElse: true })
                  //   }
                />

                <label htmlFor="option1" className={divStyle}>
                  <div className="ml-5 ">
                    <p className="text-left">Standard</p>
                    <p>up to 7 days</p>
                  </div>
                  <p className="mr-5">Free</p>
                </label>
              </div>

              <div className="w-full">
                <input
                  className="peer sr-only"
                  id="option2"
                  type="radio"
                  name="delivery"
                />

                <label htmlFor="option2" className={divStyle}>
                  <div className="ml-5">
                    <p className="text-left">24 hours</p>
                    <p>up to 24 hours</p>
                  </div>
                  <p className="mr-5">£20</p>
                </label>
              </div>
            </div>
          </div>

          {/* <!-- Payment method --> */}
          <div
            className="relative  mb-6 mt-10 overflow-hidden w-1/3 row-span-3 max-h-[1510rem] "
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
                  onClick={(e) => setPaymentChoice("card")}
                  // onClick={(e) => setToSomeOneElse(true)}

                  //   onClick={(e) =>
                  //     setFormData({ ...formData, toSomeOneElse: true })
                  //   }
                />

                <label htmlFor="option3" className={divStyle}>
                  <p className="ml-5">Pay by Card</p>
                </label>

                {paymentChoice == "card" ? (
                  <div>
                    <StripePaymentIntent />
                  </div>
                ) : null}
              </div>

              <div className="w-full">
                <input
                  className="peer sr-only"
                  id="option4"
                  type="radio"
                  name="remote"
                  onClick={(e) => setPaymentChoice("PayPal")}
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
                  <p className="text-left ml-5">Stripe</p>
                </label>
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
