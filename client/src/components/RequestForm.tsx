import React, { useContext, useState } from "react";
import axios from "../api/axios";

type RequestProps = {
  celebUid: string;
  fanUid: string;
  price: number;
};

function RequestForm({ celebUid, fanUid, price }: RequestProps) {
  const [toSomeOneElse, setToSomeOneElse] = useState<boolean>(false);
  const [checkBox, setCheckBox] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [requestAction, setRequestActon] = useState<string>();
  const [fromPerson, setFromPerson] = useState();
  const [toPerson, setToPerson] = useState();

  console.log("option", toSomeOneElse);

  async function handleRequest(e: any) {
    e.preventDefault();

    const requestData = {
      celebUid,
      fanUid,
      price,
      message,
      requestAction,
      toSomeOneElse,
      fromPerson,
      toPerson,
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/request",
        requestData
      );
      console.log("req res: ", response);
    } catch (error) {
      console.error("Error in Request Form: ", error);
    }
  }

  return (
    <>
      <div className="h-full w-full relative  ">
        <form onSubmit={handleRequest}>
          {/* <!-- Email input --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <label className="block text-sm font-medium mb-2 w-full sm:w-3/6 text-white text-left">
              Step 1: Type of video request
            </label>
            <select
              onClick={(e: any) => setRequestActon(e.target.value)}
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
                  onChange={(e: any) => setFromPerson(e.target.value)}
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
              onChange={(e: any) => setToPerson(e.target.value)}
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
              onChange={(e) => setMessage(e.target.value)}
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
    </>
  );
}

export default RequestForm;
