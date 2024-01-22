import { useState } from "react";
import { useLocation } from "react-router-dom";
import { bool } from "aws-sdk/clients/signer";
import RequestForm from "./RequestForm";
import { useAuth } from "../context/AuthContext";

function CelebProfile() {
  const [orderModal, setOrderModal] = useState<bool>(false);
  const { state } = useLocation();
  const { currentUser, celeb }: any = useAuth();

  if (!state) return; // return if there is no state
  const { name, category, reviews, price, description, photoURl, uid } = state;

  return (
    <>
      <div className="h-full  w-full relative flex flex-col text-white text-lg">
        {/* celeb pic and description */}
        <div className="flex flex-col   h-[30rem]  pb-20 ">
          <div className=" rounded-full relative left-5  w-2/5 sm:w-1/5  md:w-1/4 lg:w-[300px]  lg:h-[300px] object-cover border-4 bg-green-300 overflow-hidden ">
            <img className="w-full h-full object-cover" src={photoURl} />
          </div>
          <div className="flex flex-col pr-3">
            <p className="text-whtie text-left text-[24px] relative top-3 left-5  ">
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

        <div className=" flex flex-col justify-center  relative  h-[30rem]     ">
          <h1 className="text-whtie text-left text-[24px]  relative left-5 md:left-6 mb-5 underline font-bold  ">
            Video Display:
          </h1>
          <div className="w-full  px-5 flex gap-2">
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
            <div className="bg-red-400 h-[250px] w-3/4 border-2 rounded-xl"></div>
          </div>
        </div>

        <div className="relative py-10">
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
            <div className="bg-[#121114]    h-full w-full sm:top-0 fixed  flex justify-center items-center sm:bg-opacity-60  ">
              <div
                className="w-full sm:w-3/4 xl:w-2/5 h-full sm:h-[83%] overflow-auto sm:pt-12 bg-[#121114] border-2 shadow-md shadow-blue-300  rounded-md  px-5  relative  
              "
              >
                <div
                  onClick={() => setOrderModal(false)}
                  className="absolute  right-2 sm:right-5 top-0 sm:top-2 rounded-full  w-8 h-8 flex justify-center text-lg font-bold bg-red-500 cursor-pointer hover:bg-red-700 z-10"
                >
                  x
                </div>
                <RequestForm
                  celebUid={uid}
                  fanUid={currentUser.uid}
                  price={price}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CelebProfile;
