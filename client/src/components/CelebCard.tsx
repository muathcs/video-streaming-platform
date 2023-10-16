import React from "react";
import bitmoji from "../assets/bitmoji.png";
import celeb from "../assets/celeb.jpg";
import { useNavigate } from "react-router-dom";
function CelebCard() {
  const navigate = useNavigate();
  return (
    <div className="shadow-xl  border  bg-slate-900 rounded-t-xl rounded-md mt-10 card-zoom">
      <div className="h-[65%]  w-full overflow-hidden rounded-t-xl ">
        <img
          onClick={(e) => {
            navigate("/profile");
          }}
          src={celeb}
          className="  card-zoom-image   "
        />
      </div>
      <div className=" h-[35%] text-left left-0  relative pl-1 pt-2">
        <p>Name Here</p>
        <p className="">profession here</p>
        <p className="">Reviews</p>
        <p className="">Price</p>
      </div>
    </div>
  );
}

export default CelebCard;
