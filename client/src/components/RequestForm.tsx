import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { apiUrl } from "../utilities/fetchPath";
type RequestProps = {
  celebUid: string;
  fanUid: string;
  price: number;
};

// this is coming from the orderModal component in /CelebProfile.tsx
function RequestForm({ celebUid, fanUid, price }: RequestProps) {
  // const {
  //   data: sendUserRequestForm,
  //   loading,
  //   error,
  // } = useGlobalAxios("post", "yourDataEndpoint");

  const { data: sendPostRequest } = useGlobalAxios("post");

  const { data: postData }: any = useGlobalAxios("post", "request"); //

  console.log("price form: ", price);

  const navigate = useNavigate();

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

  async function onSubmit() {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    reset({
      ...getValues(),
      celebUid,
      fanUid,
      price,
    });

    const requestInfo = getValues(); // values from form
    await setLocalStorageRequest(getValues());
    console.log(localStorageRequest);

    // navigate("/payment", { state: requestInfo });
    postData(`${apiUrl}/request`, requestInfo);
    createNotification();
    // navigate("/success");

    reset();

    //
  }

  function createNotification() {
    console.log("made a request");
    sendPostRequest(`${apiUrl}/notification`, {
      intended_uid: celebUid,
      sender_uid: fanUid,
      message: "user has made a request",
    });
  }

  return (
    <>
      <div className="h-full w-full relative text-white bg-[#121114]   ">
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
                  onClick={() => setToSomeoneElse(true)}
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
                  onClick={() => setToSomeoneElse(false)}
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

          <div className=" flex justify-center">
            <button
              disabled={isSubmitting}
              className=" disabled:bg-red-500 block w-1/2  rounded-full my-8 border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white"
            >
              Continue
            </button>
          </div>

          {/* show vide */}
          <div className=" relative flex items-center text-sm ">
            <div className=" absolute flex">
              <p
                onClick={() => setCheckBox(!checkBox)}
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
