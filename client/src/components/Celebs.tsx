import React from "react";
import CelebCard from "./CelebCard";

function Celebs() {
  return (
    <div className="w-full h-full items-center pt-40 bg-slate-900 overflow-auto  grid xl:grid-col-6 lg:grid-cols-6   md:grid-cols-3 sm:grid-cols-2 justify-items-center">
      {[4, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, , 2, 22].map((item) => (
        <CelebCard />
      ))}
    </div>
  );
}

export default Celebs;
