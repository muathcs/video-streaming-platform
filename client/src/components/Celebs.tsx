import React, { useEffect, useState } from "react";
import CelebCard from "./CelebCard";
import { CiGlass } from "react-icons/ci";
import axios from "axios";

type CelebCardProps = {
  username: any;
  category: any;
  reviews: any;
  amount_charge: any;
  description: String;
};

function Celebs() {
  const [celebs, setCelebs] = useState<CelebCardProps[]>([]);

  async function getCelebs(e: any) {
    try {
      const response = await axios.get("http://localhost:3001/celebs");

      // save the response of celebs to the celebs array.
      const responseData: any = response.data;
      setCelebs(responseData);
    } catch (error: any) {
      console.log("mssage:", error.message);
    }
  }

  useEffect(() => {
    getCelebs("any for now");
  }, []);

  return (
    <div className="w-full h-full  relative pt-40 px-40 bg-[#121114]   overflow-auto  grid xl:grid-col-6 lg:grid-cols-5   md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-0 justify-items-center justify-center items-center">
      {celebs.map((item, index) => (
        <CelebCard
          name={item.username}
          category={item.category}
          reviews={item.reviews}
          price={item.amount_charge * 0.1}
          description={item.description}
          key={index}
        />
      ))}
    </div>
  );
}

export default Celebs;
