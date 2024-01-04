import React from "react";
import { useFormik } from "formik";
function Payment() {
  const formik = useFormik({
    initialValues: {
      deliverySpeed: "",
      paymentMethod: "",
      mobileNumber: "",
    },
    onSubmit: (values) => {
      console.log("on Submit", values);
    },
  });
  return (
    <>
      <div className="w-full flex justify-center items-center  h-full">
        <div className="h-[90%] w-2/4 relative  ">
          <form onSubmit={formik.handleSubmit}>
            {/* <!-- Email input --> */}
            <div className="relative mb-6" data-te-input-wrapper-init>
              <label className="block text-sm font-medium mb-2 w-full sm:w-4/6 text-white text-left">
                Step 1: Type of video request
              </label>
              <select
                // onClick={(e: any) => setRequestActon(e.target.value)}
                //   onClick={(e: React.MouseEvent<HTMLElement>) => {
                //     const target = e.target as HTMLSelectElement;
                //     setFormData({ ...formData, requestAction: target.value });
                //   }}
                name="types"
                value={formik.values.deliverySpeed}
                onChange={formik.handleChange}
                data-te-select-init
                className="w-full h-10 rounded-md bg-transparent border text-slate-800 cursor-pointer"
              >
                <option>Select</option>
                <option value="Holiday">Holiday</option>
                <option value="Birthday">Birthday</option>
                <option value="Pep Talk">Pep Talk</option>
                <option value="Roast">Roast</option>
                <option value="Advice">Advice</option>
                <option value="Question">Question</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* <!-- for  who --> */}

            <div className=" ">
              <p className="text-left">Step 2: Who's this video for?</p>
              <div className="gap-4 text-center sm:grid-cols-3  flex justify-center items-center  my-2">
                <div>
                  <input
                    className="peer sr-only"
                    id="option1"
                    type="radio"
                    name="remote"
                    // onClick={(e) => setToSomeOneElse(true)}

                    //   onClick={(e) =>
                    //     setFormData({ ...formData, toSomeOneElse: true })
                    //   }
                  />

                  <label
                    htmlFor="option1"
                    className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                  >
                    Someone else
                  </label>
                </div>

                <div>
                  <input
                    className="peer sr-only"
                    id="option2"
                    type="radio"
                    name="remote"
                    //   onClick={(e) =>
                    //     setFormData({ ...formData, toSomeOneElse: false })
                    //   }
                  />

                  <label
                    htmlFor="option2"
                    className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                  >
                    Myself
                  </label>
                </div>
              </div>
            </div>

            {/* personal info */}

            <div className="relative " data-te-input-wrapper-init>
              <p className="text-left">To (first name): </p>
              <input
                //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                //     const target = e.target as HTMLInputElement;
                //     setFormData({ ...formData, toPerson: target.value });
                //   }}
                type="text"
                className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                         px-3 py-[0.32rem] leading-[2.5] outline-none 
                          "
                placeholder="first name"
              />
            </div>

            {/* <!-- Request Type --> */}

            <div className=" ">
              <p className="text-left">Step 3: choose a request</p>
              <div className="gap-4 text-center sm:grid-cols-3  flex justify-center items-center  my-2">
                <div>
                  <input
                    className="peer sr-only"
                    id="option3"
                    type="radio"
                    name="remote"
                    // onClick={(e) => setToSomeOneElse(true)}

                    //   onClick={(e) =>
                    //     setFormData({ ...formData, reqType: "message" })
                    //   }
                  />

                  <label
                    htmlFor="option3"
                    className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                  >
                    Message
                  </label>
                </div>

                <div>
                  <input
                    className="peer sr-only"
                    id="option4"
                    type="radio"
                    name="remote"
                    //   onClick={(e) =>
                    //     setFormData({ ...formData, reqType: "audio" })
                    //   }
                  />

                  <label
                    htmlFor="option4"
                    className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                  >
                    Audio
                  </label>
                </div>
                <div>
                  <input
                    className="peer sr-only"
                    id="option5"
                    type="radio"
                    name="remote"
                    //   onClick={(e) =>
                    //     setFormData({ ...formData, reqType: "video" })
                    //   }
                  />

                  <label
                    htmlFor="option5"
                    className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                  >
                    video
                  </label>
                </div>
              </div>
            </div>

            {/* Message*/}

            <div className="">
              <div className="text-left">Step 4: Request details</div>
              <textarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const target = e.target as HTMLTextAreaElement;
                  // setFormData({ ...formData, message: target.value });
                }}
                className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                         px-2 py-2  h-40 shadow-sm shadow-blue-400   outline-none placeholder-style  relative
                          "
                placeholder="I'm a huge fan of your incredible work. I have a special occasion coming up, and I was wondering if you could send a personalized shout-out or a few words of encouragement to make it even more memorable."
              />
            </div>
            {/* continue */}

            <div className="">
              <button className="block w-full rounded-full my-8 border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white">
                Continue
              </button>
            </div>

            {/* show vide */}
            <div className=" relative flex items-center text-sm ">
              <div className=" absolute flex">
                <p
                  // onClick={(e) => setCheckBox(!checkBox)}
                  className="block w-[20px] bg-white rounded  mr-2 
                    outline-none text-red-400 cursor-pointer  select-none h-[20px]
                    "
                >
                  {/* {checkBox ? "✔️" : ""} */}
                </p>
                <p className="text-left sm:text-sm text-[12px]">
                  Hide this video from David Howard Thornton's profile
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Payment;
