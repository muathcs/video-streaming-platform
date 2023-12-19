import React, { useState } from "react";

function RequestForm() {
  const [toSomeOneElse, setToSomeOneElse] = useState<boolean>(false);
  const [checkBox, setCheckBox] = useState(false);

  return (
    <div className="h-full w-full relative  ">
      <form>
        {/* <!-- Email input --> */}
        <div className="relative mb-6" data-te-input-wrapper-init>
          <label className="block text-sm font-medium mb-2 w-full sm:w-3/6 text-white text-left">
            Step 1: Type of video request
          </label>
          <select
            data-te-select-init
            className="w-full h-10 rounded-md bg-transparent border text-slate-800 cursor-pointer"
          >
            <option>Select</option>
            <option value="1">Holiday</option>
            <option value="2">Birthday</option>
            <option value="3">Pep Talk</option>
            <option value="4">Roast</option>
            <option value="5">Advice</option>
            <option value="6">Question</option>
            <option value="7">Other</option>
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
                onClick={(e) => setToSomeOneElse(true)}
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
                onClick={(e) => setToSomeOneElse(false)}
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
          {toSomeOneElse && (
            <>
              <p className="text-left">From (first name): </p>
              <input
                type="text"
                className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
            px-3 py-[0.32rem] leading-[2.5] outline-none 
            "
                placeholder="first name"
              />
            </>
          )}
          <p className="text-left">To (first name): </p>
          <input
            type="text"
            className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                     px-3 py-[0.32rem] leading-[2.5] outline-none 
                      "
            placeholder="first name"
          />
        </div>

        {/* Message*/}

        <div className="">
          <div className="text-left">Step 3: Request details</div>
          <textarea
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
              onClick={(e) => setCheckBox(!checkBox)}
              className="block w-[20px] bg-white rounded  mr-2 
                outline-none text-red-400 cursor-pointer  select-none h-[20px]
                "
            >
              {checkBox ? "✔️" : ""}
            </p>
            <p className="text-left sm:text-sm text-[12px]">
              Hide this video from David Howard Thornton's profile
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RequestForm;
