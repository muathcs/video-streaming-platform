import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

type RequestProps = {
  celebuid: string;
  fanuid: string;
  price: number;
  setOrderModal: (state: boolean) => void;
};

type FormData = {
  requestAction: string;
  toSomeOneElse: string;
  fromPerson?: string;
  toPerson: string;
  message: string;
};

const MAX_MESSAGE_LENGTH = 200;

function RequestForm({ celebuid, fanuid, price, setOrderModal }: RequestProps) {
  const [messageLength, setMessageLength] = useState(0);
  const navigate = useNavigate();
  const [, setLocalStorageRequest] = useLocalStorage("request");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    watch,
  } = useForm<FormData>();

  const toSomeoneElse = watch("toSomeOneElse") === "true";
  const [hideVideo, setHideVideo] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const requestData = {
      ...data,
      reqType: "video",
      requestid: crypto.randomUUID(),
      celebuid,
      fanuid,
      price,
      hideVideo,
    };

    await setLocalStorageRequest(requestData);
    navigate("/payment");
    reset();
  };

  return (
    <div className="w-full h-full rounded-lg relative text-white bg-black px-6 overflow-auto shadow-xl">
      <button
        onClick={() => setOrderModal(false)}
        className="absolute right-4 top-4 rounded-full w-8 h-8 flex justify-center items-center text-lg font-bold bg-red-500 hover:bg-red-600 transition-colors duration-200"
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Request a Video</h2>
      <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Request Type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Step 1: Type of video request
          </label>
          <select
            {...register("requestAction", {
              required: "Please choose a request type",
            })}
            className="w-full rounded-md border border-[#3f3b45] bg-[#201e23] px-3 py-2 text-white focus:outline-none"
          >
            <option value="">Select</option>
            {[
              "Holiday",
              "Birthday",
              "Pep Talk",
              "Roast",
              "Advice",
              "Question",
              "Other",
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.requestAction && (
            <p className="mt-1 text-sm text-red-500">
              {errors.requestAction.message}
            </p>
          )}
        </div>

        {/* Step 2: Recipient */}
        <div>
          <p className="text-sm font-medium mb-2 text-gray-300">
            Step 2: Who's this video for?
          </p>
          <div className="flex space-x-4">
            {["Someone else", "Myself"].map((option, index) => (
              <div key={option} className="flex-1">
                <input
                  {...register("toSomeOneElse")}
                  className="sr-only peer"
                  id={`option${index + 1}`}
                  type="radio"
                  value={index === 0 ? "true" : "false"}
                />
                <label
                  htmlFor={`option${index + 1}`}
                  className="flex justify-center items-center w-full py-2 text-sm font-medium rounded-md border cursor-pointer border-[#3f3b45] bg-[#201e23]  hover:bg-gray-700 peer-checked:border-blue-500 peer-checked:bg-blue-600 transition-colors duration-200"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          {toSomeoneElse && (
            <div>
              <label
                htmlFor="fromPerson"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                From (first name)
              </label>
              <input
                {...register("fromPerson", {
                  required: "Please enter your name",
                })}
                id="fromPerson"
                className="w-full rounded-md border border-[#3f3b45] bg-[#201e23]  px-3 py-2 text-white focus:border-blue-200 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Your first name"
              />
              {errors.fromPerson && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fromPerson.message}
                </p>
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="toPerson"
              className="block text-sm font-medium mb-1 text-gray-300"
            >
              To (first name)
            </label>
            <input
              {...register("toPerson", {
                required: "Please enter recipient's name",
              })}
              id="toPerson"
              className="w-full rounded-md border border-[#3f3b45] bg-[#201e23]  px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Recipient's first name"
            />
            {errors.toPerson && (
              <p className="mt-1 text-sm text-red-500">
                {errors.toPerson.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-1 text-gray-300"
          >
            Step 3: Request details
          </label>
          <textarea
            {...register("message", {
              required: "Please write a message to the celebrity",
              maxLength: {
                value: MAX_MESSAGE_LENGTH,
                message: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`,
              },
            })}
            id="message"
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(e) => setMessageLength(e.target.value.length)}
            className="w-full rounded-md border border-[#3f3b45] bg-[#201e23]  px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 h-32"
            placeholder={`Write a personal message explaining your occasion and what you'd like the celebrity to say. Include details for a shout-out, special event, or words of encouragement (${MAX_MESSAGE_LENGTH} characters max).`}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <p>
              {messageLength === MAX_MESSAGE_LENGTH
                ? `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`
                : ""}
            </p>
            <p>{MAX_MESSAGE_LENGTH - messageLength} characters remaining</p>
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Hide Video Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hideVideo"
            checked={hideVideo}
            onChange={() => setHideVideo(!hideVideo)}
            className="rounded border-[#3f3b45] bg-[#201e23]  text-blue-600 focus:ring-blue-200 h-4 w-4 mr-2"
          />
          <label htmlFor="hideVideo" className="text-sm text-gray-300">
            Hide this video from David Howard Thornton's profile
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestForm;
