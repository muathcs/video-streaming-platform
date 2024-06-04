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
  setOrderModal: (state: boolean) => void;
};

// this is coming from the orderModal component in /CelebProfile.tsx
function RequestForm({ celebUid, fanUid, price, setOrderModal }: RequestProps) {
  // const {
  //   data: sendUserRequestForm,
  //   loading,
  //   error,
  // } = useGlobalAxios("post", "yourDataEndpoint");

  const { data: sendPostRequest } = useGlobalAxios("post");

  const { data: postData }: any = useGlobalAxios("post", "request"); //

  console.log("price form: ", price);

  const navigate = useNavigate();

  const [localStorageRequest, setLocalStorageRequest] =
    useLocalStorage("request");

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
      reqType: "video",
      celebUid,
      fanUid,
      price,
    });

    const requestInfo = getValues(); // values from form
    await setLocalStorageRequest(getValues());
    console.log(localStorageRequest);

    navigate("/payment", { state: requestInfo });
    createNotification();
    // postData(`${apiUrl}/request`, requestInfo);
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
      <div className="h-[90%]  w-full  md:w-3/4 lg:w-2/4 rounded-md relative text-white bg-[#222125]  px-2  sm:px-10 py-10 overflow-auto top-10  ">
        <div
          onClick={() => {
            console.log("here");
            setOrderModal(false);
          }}
          className="absolute  right-2 sm:right-5 top-0 sm:top-2 rounded-full  w-8 h-8 flex justify-center text-lg font-bold bg-red-500 cursor-pointer hover:bg-red-700 border-2"
        >
          x
        </div>
        <form className="relative top-2 p-1 " onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1 */}
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
              className="w-full h-10 rounded-md bg-transparent border text-white cursor-pointer"
            >
              <option className="text-black" value="">
                Select
              </option>
              <option className="text-black" value="Holiday">
                Holiday
              </option>
              <option className="text-black" value="Birthday">
                Birthday
              </option>
              <option className="text-black" value="Pep Talk">
                Pep Talk
              </option>
              <option className="text-black" value="Roast">
                Roast
              </option>
              <option className="text-black" value="Advice">
                Advice
              </option>
              <option className="text-black" value="Question">
                Question
              </option>
              <option className="text-black" value="Other">
                Other
              </option>
            </select>
            {errors.requestAction && (
              <p className="text-red-500">{`${errors.requestAction.message}`}</p>
            )}
          </div>

          {/* Step 2 */}
          <div className="mb-6">
            <p className="text-left mb-2">Step 2: Who's this video for?</p>
            <div className="gap-4 text-center sm:grid-cols-3 flex justify-center items-center flex-wrap">
              <div className="w-full sm:w-auto mb-2 sm:mb-0">
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
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                >
                  Someone else
                </label>
              </div>
              <div className="w-full sm:w-auto">
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
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                >
                  Myself
                </label>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="relative mb-6" data-te-input-wrapper-init>
            {toSomeoneElse && (
              <>
                <p className="text-left">From (first name): </p>
                <input
                  {...register("fromPerson", {
                    required: "input name",
                  })}
                  name="fromPerson"
                  type="text"
                  className="block min-h-[auto] w-full rounded border my-2 bg-transparent px-3 py-[0.32rem] leading-[2.5] outline-none"
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
              className="block min-h-[auto] w-full rounded border my-2 bg-transparent px-3 py-[0.32rem] leading-[2.5] outline-none"
              placeholder="first name"
            />
            {errors.toPerson && (
              <p className="text-red-500">{`${errors.toPerson.message}`}</p>
            )}
          </div>

          {/* Step 3 */}
          {/* <div className="mb-6">
            <p className="text-left mb-2">Step 3: Request Type</p>
            <div className="gap-4 text-center sm:grid-cols-3 flex justify-center items-center flex-wrap"> */}
          {/* <div className="w-full sm:w-auto mb-2 sm:mb-0">
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
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                >
                  Message
                </label>
              </div> */}
          {/* <div className="w-full sm:w-auto mb-2 sm:mb-0">
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
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 peer-checked:border-black peer-checked:shadow-lg peer-checked:shadow-blue-400 peer-checked:bg-blue-800 peer-checked:text-white bg-blue-600 text-white"
                >
                  Audio
                </label>
              </div> */}
          {/* <div className="w-full sm:w-auto">
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
                  className="block w-full rounded-lg border border-gray-200 py-3 px-8 cursor-pointer  peer-checked:border-black peer-checked:shadow-lg bg-gray-800 peer-checked:text-white  text-white"
                >
                  Video
                </label>
              </div> */}
          {/* </div>
            {errors.reqType && (
              <p className="text-red-500">{`${errors.reqType.message}`}</p>
            )}
          </div> */}

          {/* Message */}
          <div className="mb-6">
            <div className="text-left mb-2">Step 3: Request details</div>
            <textarea
              {...register("message", {
                required: "Write a message to the celeb",
                maxLength: 350,
              })}
              name="message"
              className="block min-h-[auto] w-full rounded border my-2 bg-transparent px-2 py-2 h-40 shadow-sm shadow-blue-400 outline-none placeholder-style"
              placeholder="I'm a huge fan of your incredible work. I have a special occasion coming up, and I was wondering if you could send a personalized shout-out or a few words of encouragement to make it even more memorable."
            />
            {errors.message && (
              <p className="text-red-500">{`${errors.message.message}`}</p>
            )}
          </div>

          {/* Continue */}
          <div className="flex justify-center mb-6">
            <button
              disabled={isSubmitting}
              className="disabled:bg-red-500 block w-full sm:w-1/2 rounded-full my-8 border border-gray-200 py-3 px-8 cursor-pointer hover:bg-blue-700 bg-blue-600 text-white"
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
