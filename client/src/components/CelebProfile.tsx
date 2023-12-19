import React, { useState } from "react";
import celeb from "../assets/celeb.jpg";
import { useLocation, useSearchParams } from "react-router-dom";
import { bool } from "aws-sdk/clients/signer";
import RequestForm from "./RequestForm";
import { stat } from "fs";

type CelebCardProps = {
  name: String;
  category: String;
  reviews: Number;
  price: Number;
  description: String;
};

function CelebProfile() {
  const [orderModal, setOrderModal] = useState<bool>(false);
  const { state } = useLocation();

  const { name, category, reviews, price, description } = state;
  console.log("state: ", useLocation());

  return (
    <>
      <div className="h-full w-full relative flex flex-col bg-slate-800 overflow-auto    ">
        <div className="flex flex-col">
          <div className=" rounded-full overflow-hidden relative left-5 top-2 w-2/5 sm:w-1/5 md:w-1/4 lg:w-1/6 border-2 bg-green-300 ">
            <img src={celeb} />
          </div>
          <div className="  flex flex-col pr-3">
            <p className="text-whtie text-left text-[24px] relative top-3 left-5 ">
              Name: {name}
            </p>
            <p className="text-left text-[18px] relative top-3 left-5 text-gray-600">
              {category}
            </p>
            <p className="text-whtie text-left text-[20px] relative top-3 left-5 text-black">
              {"⭐".repeat(reviews)}
            </p>

            <p className="text-whtie text-left text-[16px] md:w-1/2 md:text-[20px] relative top-3 left-5 text-gray-400 whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>

        <div className=" flex flex-col pt-5 relative top-10 gap-10 h-full ">
          <h1 className="text-whtie text-left text-[24px] relative left-5 md:left-6 underline font-bold  ">
            Video Display:
          </h1>
          <div className="w-full h-[150%] px-5 flex gap-2">
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
          </div>
        </div>

        <div className="relative top-20 pb-5">
          <button
            onClick={(e) => setOrderModal(true)}
            className=" relative  w-1/2 md:w-1/5 rounded-md hover:bg-slate-700 bg-slate-500  text-white hover:border-none outline-none focus:outline-none border-none"
          >
            Book A Shoutout
          </button>
        </div>
        {orderModal && (
          <>
            <div className="bg-black   h-full w-full sm:top-0 fixed flex justify-center items-center sm:bg-opacity-80  ">
              <div
                className="w-full sm:w-3/4 xl:w-2/5 h-full sm:h-4/5  sm:pt-12 bg-slate-800 rounded-md  px-5 relative  
              "
              >
                <div
                  onClick={(e) => setOrderModal(false)}
                  className="absolute  right-2 sm:right-5 top-0 sm:top-2 rounded-full  w-8 h-8 flex justify-center text-lg font-bold bg-red-500 cursor-pointer hover:bg-red-700 z-10"
                >
                  x
                </div>
                <RequestForm />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CelebProfile;
