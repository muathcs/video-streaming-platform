import React, { useContext, useState } from "react";
import axios from "../api/axios";
import { useGlobalPut } from "../hooks/useGlobaPut";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { error } from "console";
import { RequestContext } from "../context/RequestContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
type RequestProps = {
  celebUid: string;
  fanUid: string;
  price: number;
};

function RequestForm({ celebUid, fanUid, price }: RequestProps) {
  const navigate = useNavigate();
  // const {
  //   data: sendUserRequestForm,
  //   loading,
  //   error,
  // } = useGlobalAxios("post", "yourDataEndpoint");

  const { request, setRequest } = useContext(RequestContext);

  const [localStorageRequest, setLocalStorageRequest] = useLocalStorage(
    "request",
    ""
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const [checkBox, setCheckBox] = useState(false);
  const [toSomeoneElse, setToSomeoneElse] = useState(false);

  function handleRequest(e: any) {
    e.preventDefault();

    // sendRequest("request", formData);
  }

  async function onSubmit(data: FieldValues) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    reset({
      ...getValues(),
      celebUid,
      fanUid,
      price,
    });

    // try {
    //   sendUserRequestForm("request", getValues());
    // } catch (error) {
    //   console.error(error);
    // }
    const requestInfo = getValues();
    await setLocalStorageRequest(getValues());

    setRequest(requestInfo);
    navigate("/payment", { state: requestInfo });

    reset();
  }

  async function testfuck() {
    setLocalStorageRequest({ name: "xxx", age: 18 });
  }

  return (
    <>
      <div className="h-full w-full relative   ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <!-- Email input --> */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            <label className="block text-sm font-medium mb-2 w-full sm:w-4/6 text-white text-left">
              Step 1: Type of video request
            </label>
            <select
              {...register("requestAction", {
                required: "choose a request event",
              })}
              name="requestAction"
              data-te-select-init
              className="w-full h-10 rounded-md bg-transparent border text-slate-800 cursor-pointer"
            >
              <option value="">Select</option>
              <option value="Holiday">Holiday</option>
              <option value="Birthday">Birthday</option>
              <option value="Pep Talk">Pep Talk</option>
              <option value="Roast">Roast</option>
              <option value="Advice">Advice</option>
              <option value="Question">Question</option>
              <option value="Other">Other</option>
            </select>
            {errors.requestAction && (
              <p className="text-red-500">{`${errors.requestAction.message}`}</p>
            )}
          </div>

          {/* <!-- for  who --> */}

          <div className=" ">
            <p className="text-left">Step 2: Who's this video for?</p>
            <div className="gap-4 text-center sm:grid-cols-3  flex justify-center items-center  my-2">
              <div>
                <input
                  {...register("toSomeOneElse")}
                  className="peer sr-only"
                  id="option1"
                  type="radio"
                  name="toSomeOneElse"
                  onClick={(e) => setToSomeoneElse(true)}
                  value="true"
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
                  value="false"
                  onClick={(e) => setToSomeoneElse(false)}
                  {...register("toSomeOneElse")}
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
            {toSomeoneElse && (
              <>
                <p className="text-left">From (first name): </p>
                <input
                  {...register("fromPerson", {
                    required: "input name",
                  })}
                  name="fromPerson"
                  type="text"
                  className=" block min-h-[auto] w-full rounded border my-2 bg-transparent 
            px-3 py-[0.32rem] leading-[2.5] outline-none 
            "
                  placeholder="first name"
                />
                {errors.fromPerson && (
                  <p className="text-red-500">{`${errors.fromPerson.message}`}</p>
                )}
              </>
            )}
            <p className="text-left">To (first name): </p>
            <input
              {...register("toPerson", {
                required: "Input name",
              })}
              name="toPerson"
              type="text"
              className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                     px-3 py-[0.32rem] leading-[2.5] outline-none 
                      "
              placeholder="first name"
            />
            {errors.toPerson && (
              <p className="text-red-500">{`${errors.toPerson.message}`}</p>
            )}
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
                  {...register("reqType", {
                    required: "choose request: Message, Audio or Video",
                  })}
                  name="reqType"
                  value="message"
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
                  {...register("reqType", {
                    required: "choose request: Message, Audio or Video",
                  })}
                  name="reqType"
                  value="audio"
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
                  {...register("reqType", {
                    required: "choose request: Message, Audio or Video",
                  })}
                  name="reqType"
                  value="video"
                />

                <label
                  htmlFor="option5"
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700   peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                >
                  video
                </label>
              </div>
            </div>
            {errors.reqType && (
              <p className="text-red-500">{`${errors.reqType.message}`}</p>
            )}
          </div>

          {/* Message*/}

          <div className="">
            <div className="text-left">Step 4: Request details</div>
            <textarea
              {...register("message", {
                required: "Write a message to the celeb",
                maxLength: 350,
              })}
              name="message"
              className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
                     px-2 py-2  h-40 shadow-sm shadow-blue-400   outline-none placeholder-style  relative
                      "
              placeholder="I'm a huge fan of your incredible work. I have a special occasion coming up, and I was wondering if you could send a personalized shout-out or a few words of encouragement to make it even more memorable."
            />
          </div>
          {errors.message && (
            <p className="text-red-500">{`${errors.message.message}`}</p>
          )}
          {/* continue */}

          <div className="">
            <button
              disabled={isSubmitting}
              className=" disabled:bg-red-500 block w-full rounded-full my-8 border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white"
            >
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
