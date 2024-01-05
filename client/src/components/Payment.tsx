import React, { useState } from "react";
import { useFormik } from "formik";
function Payment() {
  const [delivery, setDelivery] = useState();

  const divStyle =
    "border-2  h-32 w-full rounded-md shadow-md peer-checked:shadow-blue-200 peer-checked:bg-blue-600  cursor-pointer flex items-center justify-between ";

  return (
    <>
      <div className="w-full flex justify-center items-center h-full overflow-auto ">
        <div className="h-full w-2/4 relative   ">
          <form>
            {/* <!-- Email input --> */}
            <div className="relative  mb-6" data-te-input-wrapper-init>
              <div className="gap-4 text-center sm:grid-cols-3  flex flex-col justify-center items-center  my-2">
                <p className="text-left w-full font-serif text-lg font-bold">
                  Delivery Speed
                </p>
                <div className=" w-full">
                  <input
                    className="peer sr-only border-2 w-full"
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

            {/* <!-- for  who --> */}
            <div className="relative  mb-6 mt-10" data-te-input-wrapper-init>
              <p className="text-left text-lg font-bold font-serif ">
                Payment method
              </p>
              <div className="gap-4 text-center sm:grid-cols-3  flex flex-col justify-center items-center  my-2">
                <div className=" w-full">
                  <input
                    className="peer sr-only border-2 w-full"
                    id="option3"
                    type="radio"
                    name="remote"
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

            <div className="pb-10">
              <button className="block w-full rounded-full my-8 border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Payment;
