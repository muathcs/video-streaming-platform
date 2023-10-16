import React from "react";
import celeb from "../assets/celeb.jpg";
function CelebProfile() {
  return (
    <>
      <div className="h-full w-full relative flex flex-col bg-slate-800 overflow-auto ">
        <div className="flex flex-col">
          <div className=" rounded-full overflow-hidden relative left-5 top-2 w-2/5 sm:w-1/5 md:w-1/4 lg:w-1/6 border-2 bg-green-300 ">
            <img src={celeb} />
          </div>
          <div className="  flex flex-col pr-3">
            <p className="text-whtie text-left text-[24px] relative top-3 left-5 ">
              Name: Celeb Name
            </p>
            <p className="text-left text-[18px] relative top-3 left-5 text-gray-600">
              Celeb professionality
            </p>
            <p className="text-whtie text-left text-[20px] relative top-3 left-5 text-black">
              ⭐⭐⭐⭐⭐
            </p>

            <p className="text-whtie text-left text-[16px] md:w-1/2 md:text-[20px] relative top-3 left-5 text-gray-400 whitespace-pre-line">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
              repellendus ratione autem inventore nostrum minima ducimus maxime,
              labore ipsa maiores.
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
          <button className=" relative  w-1/2 md:w-1/5 rounded-md hover:bg-slate-700 bg-slate-500  text-white hover:border-none outline-none focus:outline-none border-none">
            Book A Shoutout
          </button>
        </div>
      </div>
    </>
  );
}

export default CelebProfile;
