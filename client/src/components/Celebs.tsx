import React, { useEffect, useState } from "react";
import CelebCard from "./CelebCard";
import { CiGlass } from "react-icons/ci";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useGlobalDataFetch } from "../hooks/useGlobalDataFetch";
import { CelebType } from "../TsTypes/types";
import { useGlobalAxios } from "../hooks/useGlobalAxios";

function Celebs() {
  const { data, loading, error } = useGlobalAxios(
    "get",
    "http://localhost:3001/celebs"
  );

  return (
    <div className="w-full h-full  relative pt-40 px-40 overflow-auto  grid xl:grid-col-6 lg:grid-cols-3 xl:grid-cols-4    md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-0 justify-items-center justify-center items-center">
      {loading ? (
        <h1>Loading</h1>
      ) : error ? (
        <h1>Error</h1>
      ) : (
        [...data]
          .reverse()
          .map((item, index) => (
            <CelebCard
              name={item.displayname}
              category={item.category}
              reviews={item.reviews}
              price={item.price * 0.1}
              description={item.description}
              photoURl={item.imgurl}
              uid={item.uid}
              key={index}
            />
          ))
      )}
    </div>
  );
}

export default Celebs;
