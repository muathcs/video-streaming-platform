import React, { Dispatch, SetStateAction, useState } from "react";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import { useAuth } from "../context/AuthContext";
import { start } from "repl";
import { IoClose } from "react-icons/io5";
import { apiUrl } from "../utilities/fetchPath";
import axios from "@/api/axios";

type ReviewInputProp = {
  setOpenModal: (state: boolean) => void;
  requestid: string;
  fanuid: string;
  celebuid: string;
  date: string;
  event: string;
  isReviewed: boolean;
  reviewMessage: string;
  setReviewMessage: Dispatch<SetStateAction<string>>; // more flexible than (review:string) => voild because it takes a function as well as a string val.
  setRated: Dispatch<SetStateAction<number | undefined>>; // more flexible than (review:string) => voild because it takes a function as well as a string val.
  rated: number | undefined;
};
function ReviewInput({
  setOpenModal,
  fanuid,
  celebuid,
  date,
  event,
  requestid,
  isReviewed,
  reviewMessage,
  setReviewMessage,
  rated,
  setRated,
}: ReviewInputProp) {
  console.log("celebuid: ", isReviewed);
  const [review, setReview] = useState<string>("");
  const { userInfo }: any = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  console.log("rated: ", rated);
  const [hoveredStars, setHoveredStars] = useState<number>(rated || 5);
  const totalStars = 5;

  const { data: sendPostRequest, error } = useGlobalAxios("post");

  async function submitReview() {
    setLoading(true);
    try {
      await sendPostRequest(`${apiUrl}/reviews`, {
        review,
        fanuid,
        celebuid,
        event,
        date,
        requestid,
        rating: hoveredStars,
        name: userInfo.displayname,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function editReview() {
    setLoading(true);
    try {
      await axios.put(`${apiUrl}/reviews/${isReviewed}`, {
        review: reviewMessage,
        rating: hoveredStars,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" min-w-1xl flex flex-col rounded-xl shadow-lg bg-white">
      <div className="px-12 py-5 flex  justify-between">
        <h2 className="text-gray-800 text-3xl font-semibold">
          Your opinion matters to us!
        </h2>
        <span
          onClick={() => setOpenModal(false)}
          className=" text-red-500 text-[30px] absolute right-5 top-5 cursor-pointer "
        >
          <IoClose />
        </span>
      </div>
      <div className="bg-gray-800 w-full flex flex-col items-center">
        <div className="flex flex-col items-center py-6 space-y-3">
          <span className="text-lg text-gray-800">
            How was the quality of the response?
          </span>
          <div className="flex space-x-3   h-12  cursor-pointer  ">
            {[...Array(totalStars)].map((_, index) => {
              const starValue = index + 1;
              const isYellow = starValue <= hoveredStars;
              return (
                <>
                  <svg
                    onMouseOver={() => {
                      setHoveredStars(starValue);
                      setRated(starValue);
                    }}
                    style={{ color: isYellow ? "yellow" : "grey" }}
                    className="w-12 h-12 text-yellow-500 review-star"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </>
              );
            })}
          </div>
        </div>
        <div className="w-3/4 flex flex-col">
          {isReviewed ? (
            <>
              <textarea
                value={reviewMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReviewMessage(e.target.value)
                }
                name="message"
                className=" block min-h-[auto] w-full rounded border my-2 bg-transparent bg-white
                 px-2 py-2  h-40 shadow-sm  text-black bg-gray-5 border-gray-300   placeholder-style outline-none relative
                  "
                placeholder="Thank you, this was great!"
              />
              <button
                onClick={editReview}
                disabled={loading}
                className="py-3 my-8 text-lg bg-gradient-to-r border border-gray-100 bg-gray-800 hover:bg-gray-700  rounded-xl text-white"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </>
          ) : (
            <>
              <textarea
                value={review}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReview(e.target.value)
                }
                name="message"
                className=" block min-h-[auto] w-full rounded border my-2 bg-transparent bg-white
             px-2 py-2  h-40 shadow-sm  text-black bg-gray-5 border-gray-300   placeholder-style outline-none relative
              "
                placeholder="Thank you, this was great!"
              />
              <button
                onClick={submitReview}
                disabled={loading}
                className="py-3 my-8 text-lg bg-gradient-to-r border border-gray-100 bg-gray-800 hover:bg-gray-700  rounded-xl text-white"
              >
                {loading ? "Reviewing..." : "Review"}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="h-20 flex items-center justify-center  ">
        <span
          onClick={() => setOpenModal(false)}
          className="text-gray-600 hover:cursor-pointer border rounded-md border-gray-150 px-5 py-5 hover:bg-gray-100 "
        >
          Maybe later
        </span>
      </div>
    </div>
    // <div
    //   onClick={() => {
    //   }}
    //   className=" w-full p-4  rounded-xl bg-white   "
    // >
    //   <button
    //     onClick={() => {
    //       setOpenModal(false);
    //     }}
    //     className=" right-5 top-2 absolute   text-black  p-5   hover:cursor-pointer  "
    //   >
    //     X
    //   </button>
    //   <div className="mb-4 gap-1">
    //     <p>Send bugs</p>
    //     <p className="text-gray-500">Share your feedback, type in a review</p>
    //   </div>
    //   <div>
    //     <textarea
    //       value={review}
    //       onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
    //         setReview(e.target.value)
    //       }
    //       name="message"
    //       className=" block min-h-[auto] w-full rounded border my-2 bg-transparent
    //          px-2 py-2  h-40 shadow-sm  text-black bg-gray-5 border-gray-300   placeholder-style outline-none relative
    //           "
    //       placeholder="Thank you, this was great!"
    //     />
    //   </div>
    //   <button
    //     onClick={submitReview}
    //     className="bg-red-400 rounded-md py-3 items-center justify-center mt-3 w-full "
    //   >
    //     <p className="text-white text-md">Submit Review</p>
    //   </button>
    // </div>
  );
}

export default ReviewInput;
