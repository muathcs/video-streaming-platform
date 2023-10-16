import React from "react";
import CelebCard from "./CelebCard";

function Celebs() {
  return (
    <div className="w-full h-full  relative pt-40 px-40 bg-slate-900   overflow-auto  grid xl:grid-col-6 lg:grid-cols-5   md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-0 justify-items-center justify-center items-center">
      {[4, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, , 2, 22].map((item) => (
        <CelebCard />
      ))}
    </div>
  );
}

export default Celebs;
