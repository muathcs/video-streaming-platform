import React from "react";
import bitmoji from "../assets/bitmoji.png";
import celeb from "../assets/celeb.jpg";
function CelebCard() {
  return (
    <div className="shadow-xl  w-[15rem] h-[20rem] bg-black border rounded-t-xl rounded-md ">
      <div className="h-[65%]  ">
        <img src={celeb} className=" w-full h-[80%]   rounded-t-xl " />
      </div>
      <div className=" h-[35%] text-left relative pl-3 pt-2">
        <p>Name Here</p>
        <p className="">profession here</p>
        <p className="">Reviews</p>
        <p className="">Price</p>
      </div>
    </div>
  );
}

export default CelebCard;
