import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { bool } from "aws-sdk/clients/signer";
import RequestForm from "../components/RequestForm";
import { useAuth } from "../context/AuthContext";
import { CelebType, ReviewsType } from "../TsTypes/types";
import Review from "../components/Review";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import axios from "../api/axios";
import Modal from "../components/Modal";
import { formatter } from "../utilities/currencyFormatter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

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

type ReviewSectionPlusReviewModalProps = {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  reviews: ReviewsType[];
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
        <div className="max-w-7xl h-10 w-full flex flex-col mb-80 relative px-2">
          <Carousel className=" mb-20 ">
            <div className="w-full  h-10 relative  mb-5 flex items-center ">
              <p className="text-xl font-semibold ">Reviews</p>
              <div className="absolute right-16 top-5 ">
                <CarouselPrevious className="  bg-[#1C1C1F] w-10 h-10 border-gray-600  " />
                <CarouselNext className="bg-[#1C1C1F]  w-10 h-10  border-gray-600" />
              </div>
            </div>
            <CarouselContent>
              {reviews &&
                reviews.slice(0, 10).map((review, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/1 md:basis-1/2 lg:basis-1/3 "
                  >
                    <Review
                      date={review.Date}
                      event={review.event}
                      message={review.message}
                      name={review.reviewer_name}
                      rating={review.rating}
                    />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <div className=" text-end">
              <p
                onClick={() => {
                  setOpenModal(true);
                }}
                className="text-whtie  text-[20px]   underline font-bold cursor-pointer text-end"
              >
                View All Reviews
              </p>
            </div>
          </Carousel>
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
    <div className="bg-[#121114]    h-full w-full top-0 fixed  flex justify-center items-center sm:bg-opacity-60 z-10     ">
      {/* <div
       
        className="w-full sm:w-3/4 xl:w-2/5 h-full sm:h-[83%] overflow-auto sm:pt-12 bg-[#121114]  border-2 shadow-md shadow-blue-300  rounded-md  px-5  relative bg-yellow-300 
    "
      > */}

      <RequestForm
        setOrderModal={setOrderModal}
        celebuid={celebInfo.uid}
        fanuid={currentUserUid}
        price={celebInfo.price}
      />
    </div>
    // </div>
  );
}

function CelebInfoDisplay({
  imgurl,
  price,
  category,
  rating,
  description,
  displayname,
}: Pick<
  CelebType,
  "imgurl" | "price" | "category" | "rating" | "description" | "displayname"
>) {
  return (
    <div className="flex flex-col mb-10 pb-20 mt-10 ">
      <div className=" rounded-full relative left-5 w-52 h-52   border  overflow-hidden ">
        <img className="w-full h-full object-cover" src={imgurl} />
      </div>
      <div className="flex flex-col pr-3">
        <p className="text-whtie text-left text-[24px] relative top-3 left-5  ">
          Name: {displayname} {formatter.format(price)}
        </p>

        <p className="text-left text-[18px] relative top-3 left-5 text-gray-600">
          {category}
        </p>
        <p className="text-whtie text-left text-[20px] relative top-3 left-5 text-black">
          {"⭐".repeat(rating + 5)}
        </p>

        <p className="text-whtie text-left text-[16px] md:w-1/2 md:text-[20px] relative top-3 left-5 text-gray-400 whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}

function VideoSection() {
  return (
    <Carousel className="w-full max-w-lg ">
      <CarouselContent className="">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="ml-16 w-16 h-16" />
      <CarouselNext className="mr-16  w-16 h-16 " />
    </Carousel>
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
  const [reviews, setReviews] = useState<ReviewsType[]>();
  const [openModal, setOpenModal] = useState(false);

  const { celeb: celebInfo }: StateType = state;
  const {
    displayname,
    imgurl,
    category,
    price,
    description,
    reviews: rating,
    ...rest
  }: CelebType = celebInfo;

  async function getReviews() {
    try {
      const result = await axios.get("/reviews", {
        params: {
          uid: celebInfo.uid,
        },
      });

      setReviews(result.data);
    } catch (error) {}
  }

  useEffect(() => {
    getReviews();
  }, [celebInfo]);
  return (
    <>
      <div className="  w-[99%] flex  flex-col relative   text-white text-lg  bg-black  ">
        {/* celeb pic and description */}
        <CelebInfoDisplay
          displayname={displayname}
          imgurl={imgurl}
          category={category}
          rating={rating}
          description={description}
          price={price}
        />

        {/* Videos */}
        <div className=" flex justify-center">
          <VideoSection />
        </div>

        {/* Review Section */}

        <div className=" h-max py-10  flex justify-center">
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

        <div className="relative py-10 flex justify-center  ">
          <button
            onClick={() => setOrderModal(true)}
            className=" relative  w-1/2 md:w-1/5 rounded-md hover:bg-slate-700 py-5 bg-slate-500  text-white hover:border-none outline-none focus:outline-none border-none "
          >
            Book A Shoutouta
          </button>
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
