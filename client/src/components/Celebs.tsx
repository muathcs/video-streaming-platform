import React from "react";
import CelebCard from "./CelebCard";

function Celebs() {
  return (
    <div className="w-full h-full  flex justify-center items-center ">
      <div className="px-10 items-center w-full grid xl:grid-col-8 lg:grid-cols-6 md:grid-cols-3 justify-items-center ">
        {[4, 1, 1, 2, 2, 1].map((item) => (
          <CelebCard />
        ))}
      </div>
    </div>
  );
}

export default Celebs;
