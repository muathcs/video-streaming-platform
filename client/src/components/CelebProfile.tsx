import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { bool } from "aws-sdk/clients/signer";
import RequestForm from "./RequestForm";
import { useAuth } from "../context/AuthContext";
import { CelebType } from "../TsTypes/types";
import Review from "./Review";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import axios from "../api/axios";
import Modal from "./Modal";
import { formatter } from "../utilities/currencyFormatter";

type StateType = {
  celeb: CelebType;
  // other properties in the state
};
Date: "2024-03-09T19:04:27.771Z";
celebCelebid: null;
event: "Pep Talk";
message: "Wow this was greate, thank you so much for doing this. ";
reviewed_id: "jt7hAMGak2bQNPLhCkhLbBn3hmQ2";
reviewer_id: "GftG290txWMsA1ddMVgMcf4WoUs2";
reviewer_name: "z";
reviewid: "3594d349-12b3-4670-8ad7-2442d5a00b4e";

type reviewsType = {
  Date: Date;
  celebCelebid: string;
  event: string;
  message: string;
  reviewed_id: string;
  reviewer_id: string;
  rating: number;
  reviewer_name: string;
  reviewid: string;
};

type ReviewSectionPlusReviewModalProps = {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  reviews: reviewsType[];
};

// this is the review section shown in the celebprofile
function ReviewSectionPlusReviewModal({
  openModal,
  setOpenModal,
  reviews,
}: ReviewSectionPlusReviewModalProps) {
  return (
    <div className=" flex flex-col justify-center        ">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <div className="bg-[#201E23] py-2 flex justify-end items-start ">
          <button
            className="relative right-2 borde text-lg px-3 "
            onClick={() => setOpenModal(false)}
          >
            X
          </button>
        </div>

        <div className=" flex flex-col w-full gap-1 h-[70vh] overflow-auto py-10 px-4 bg-[#201E23]">
          <h1 className="text-[28px] ml-2">ALL Reviews</h1>
          {reviews &&
            reviews.reverse().map((review) => (
              <div className="border-b-2 border-gray-500  w-full bg-[#201E23] ">
                <Review
                  date={review.Date}
                  event={review.event}
                  message={review.message}
                  name={review.reviewer_name}
                  rating={review.rating}
                />
              </div>
            ))}
        </div>
      </Modal>
      <div className="">
        <div className="flex justify-between px-5">
          <h1 className="text-whtie text-left text-[24px] md:left-6 mb-5  font-bold  ">
            Reviews:
          </h1>
          <p
            onClick={() => {
              setOpenModal(true);
            }}
            className="text-whtie text-left text-[24px]   underline font-bold cursor-pointer"
          >
            view all ({reviews.length})
          </p>
        </div>
        <div className="w-full  px-5 md:flex gap-2 flex-row  ">
          {reviews &&
            reviews
              .slice(-3) //gets last 3 reviews
              .reverse() // reverse them so the newest is on the left
              .map((review) => (
                <Review
                  date={review.Date}
                  event={review.event}
                  message={review.message}
                  name={review.reviewer_name}
                  rating={review.rating}
                />
              ))}

          {/* <div className="bg-[#201E23] h-[250px] w-3/4 border-2 rounded-xl"></div> */}
          {/* <div className="bg-[#201E23] h-[250px] w-3/4 border-2 rounded-xl"></div> */}
          {/* <div className="bg-[#201E23] h-[250px] w-3/4 border-2 rounded-xl"></div> */}
        </div>
      </div>
    </div>
  );
}

type OrderModalType = {
  setOrderModal: (state: boolean) => void;
  celebInfo: CelebType;
  currentUserUid: string;
};

// this is the order form shown on the celeb profile when Book a shoutout is clicked
function OrderModal({
  setOrderModal,
  celebInfo,
  currentUserUid,
}: OrderModalType) {
  return (
    <div
      onClick={() => {
        console.log("herexx");
      }}
      className="bg-[#121114]    h-full w-full sm:top-0 fixed  flex justify-center items-center sm:bg-opacity-60 z-10    "
    >
      <div
        onClick={() => {
          console.log("fitrs");
        }}
        className="w-full sm:w-3/4 xl:w-2/5 h-full sm:h-[83%] overflow-auto sm:pt-12 bg-[#121114]  border-2 shadow-md shadow-blue-300  rounded-md  px-5  relative 
    "
      >
        <div
          onClick={() => {
            console.log("here");
            setOrderModal(false);
          }}
          className="absolute  right-2 sm:right-5 top-0 sm:top-2 rounded-full  w-8 h-8 flex justify-center text-lg font-bold bg-red-500 cursor-pointer hover:bg-red-700 border-2"
        >
          x
        </div>
        <RequestForm
          celebUid={celebInfo.uid}
          fanUid={currentUserUid}
          price={celebInfo.price}
        />
      </div>
    </div>
  );
}

// this shows the celeb profile,

// the componenent above it ReviewSectionPlusReviewModal handles the review section in the celebProfile.
function CelebProfile() {
  const { state } = useLocation();
  if (!state) return null; // return if there is no state
  const [orderModal, setOrderModal] = useState<bool>(false);
  const { currentUser, celeb }: any = useAuth();
  const { data: getData, error, loading } = useGlobalAxios("get");
  const [reviews, setReviews] = useState<reviewsType[]>();
  const [openModal, setOpenModal] = useState(false);

  const { celeb: celebInfo }: StateType = state;

  async function getReviews() {
    try {
      const result = await axios.get("/reviews", {
        params: {
          uid: celebInfo.uid,
        },
      });

      setReviews(result.data);

      console.log("rev res: ", result.data);
    } catch (error) {}
  }

  useEffect(() => {
    console.log("useEffect");
    getReviews();
  }, [celebInfo]);
  return (
    <>
      <div className="h-full  w-[99%] flex  flex-col relative   text-white text-lg  ">
        {/* celeb pic and description */}
        <div className="flex flex-col mb-10 pb-20 mt-10 ">
          <div className=" rounded-full relative left-5 w-52 h-52   border bg-green-300 overflow-hidden ">
            <img
              className="w-full h-full object-cover"
              src={celebInfo.imgurl}
            />
          </div>
          <div className="flex flex-col pr-3">
            <p className="text-whtie text-left text-[24px] relative top-3 left-5  ">
              Name: {celebInfo.displayname} {formatter.format(celebInfo.price)}
            </p>

            <p className="text-left text-[18px] relative top-3 left-5 text-gray-600">
              {celebInfo.category}
            </p>
            <p className="text-whtie text-left text-[20px] relative top-3 left-5 text-black">
              {"⭐".repeat(celebInfo.reviews + 5)}
            </p>

            <p className="text-whtie text-left text-[16px] md:w-1/2 md:text-[20px] relative top-3 left-5 text-gray-400 whitespace-pre-line">
              {celebInfo.description}
            </p>
          </div>
        </div>

        <div className=" h-max py-10  ">
          {reviews && reviews?.length > 0 ? (
            <ReviewSectionPlusReviewModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              reviews={reviews}
            />
          ) : (
            <p>{celebInfo.displayname} does Not have any reviews </p>
          )}
        </div>

        <div className="relative py-10 ">
          {!celeb ? (
            <button
              onClick={() => setOrderModal(true)}
              className=" relative  w-1/2 md:w-1/5 rounded-md hover:bg-slate-700 py-5 bg-slate-500  text-white hover:border-none outline-none focus:outline-none border-none"
            >
              Book A Shoutouta
            </button>
          ) : (
            ""
          )}
        </div>
        {orderModal && (
          <>
            <OrderModal
              celebInfo={celebInfo}
              currentUserUid={currentUser.uid}
              setOrderModal={setOrderModal}
            />
          </>
        )}
      </div>
    </>
  );
}

export default CelebProfile;
