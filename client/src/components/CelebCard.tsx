import React from "react";
import bitmoji from "../assets/bitmoji.png";
import celeb from "../assets/celeb.jpg";
import { useNavigate } from "react-router-dom";

type CelebCardProps = {
  name: any;
  category: any;
  reviews: any;
  price: any;
  description: String;
};

function CelebCard({
  name,
  category,
  reviews,
  price,
  description,
}: CelebCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Pass information about the clicked celeb as state
    navigate("/profile", {
      state: { name, category, reviews, price, description },
    });
  };

  return (
    <div className="shadow-xl  border  bg-[#121114]  rounded-t-xl rounded-md mt-10 card-zoom">
      <div className="h-[65%]  w-full overflow-hidden rounded-t-xl ">
        <img
          onClick={handleCardClick}
          src={celeb}
          className="card-zoom-image"
        />
      </div>
      <div className=" h-[35%] text-left left-1  relative pl-1 pt-2">
        <p>{"ge"}</p>
        <p className="">{category}</p>
        <p className="">{reviews}</p>
        <p className="">£{price.toFixed(2)}</p>
      </div>
    </div>
  );
}
export default CelebCard;
