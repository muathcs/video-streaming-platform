import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CelebCard from "./CelebCard";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";

function Category() {
  const { category } = useParams();

  const [celebs, setCelebs] = useState<CelebType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // get all the celebs that match the param
  useEffect(() => {
    setLoading(true);
    const fetchCelebs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/celebs/${category}`
        );

        setCelebs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchCelebs();
  }, []);
  return (
    <div className="flex justify-center relative top-10 h-full  ">
      <div className="flex  relative top-10 h-full w-4/5   ">
        <div className=" w-[80%] relative">
          <h1 className="text-left">{category}</h1>
          <div className=" h-full   ">
            {/* top section */}
            <div className=" h-1/6 flex justify-between ">
              <div className="w-1/2 flex items-start justify-center gap-5 flex-col ">
                <p className="text-[24px] text-left ">121 results</p>
                <span className="flex">
                  <p className="px-5 py-2 bg-gray-700 rounded-l-sm">24 hours</p>
                  <button className=" py-2 bg-red-800  rounded-r-md px-2 cursor-pointer">
                    X
                  </button>
                </span>
              </div>
              <div className=" w-1/2 flex justify-center items-center gap-12">
                <button className="rounded-full  px-5 w-1/4 py-4 self-center border-2 hover:bg-[#35333a]">
                  Featured ⬇️
                </button>
                <button className="rounded-full  px-5 py-4 w-1/4 self-center border-2 hover:bg-[#35333a]">
                  Hide Filters
                </button>
                <button className="rounded-full  px-5 py-4 w-1/4 self-center border-2 hover:bg-[#35333a]">
                  💫 24 hour delivery
                </button>
              </div>
            </div>
            {/* celebs */}
            <div className="h-5/6 relative  justify-items-start   grid  lg:grid-cols-3 xl:grid-cols-4   md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-0  ">
              {/* celebs */}
              {loading ? (
                <h1>Loading</h1>
              ) : !celebs ? (
                <h1>Error</h1>
              ) : (
                [...celebs]
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
          </div>
        </div>
        <div className="border-2   w-[20%]">hello</div>
      </div>
    </div>
  );
}

export default Category;
