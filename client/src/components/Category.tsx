import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CelebCard from "./CelebCard";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";
import { apiUrl } from "../utilities/fetchPath";
import Filter from "./Filter";
// import { GiCardKingClubs } from "react-icons/gi";
function Category() {
  const { category } = useParams();

  const [celebs, setCelebs] = useState<CelebType[]>([]);
  const [originalCelebs, setOriginalCelebs] = useState<CelebType[]>([]); // used as a copy for filtering
  const [hideFilter, setHideFilter] = useState<Boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  function removeFilter(filterName: string) {
    console.log("filterNamex: ", filterName);

    const newFilter = selectedFilters.filter(
      (filter) => filter.filterName != filterName
    );

    setSelectedFilters(newFilter);
  }

  // get all the celebs that match the param
  useEffect(() => {
    console.log("inside useEffect");
    // setLoading(true);
    const fetchCelebs = async () => {
      console.log("making Get REquest");
      try {
        console.log("inside try ");
        const response = await axios.get(`${apiUrl}/celebs/${category}`);

        console.log("celeb: ", response.data);
        setCelebs(response.data);
        setOriginalCelebs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("error: ", error);
      }
    };

    // return () => {
    fetchCelebs();
    // };
  }, []);

  return (
    <div className="flex justify-center relative top-10 h-full   ">
      <div className="flex  relative top-10 h-full w-4/5">
        <div className={`${hideFilter ? "w-full" : "w-[80%]"} relative`}>
          <h1 className="text-left">{category}</h1>
          <div className=" h-full    ">
            {/* top section */}
            <div className=" h-1/6 flex justify-between ">
              <div className="w-1/2 flex items-start justify-center gap-5 flex-col ">
                <p className="text-[24px] text-left ">
                  {celebs.length} results
                </p>
                {selectedFilters.map((filter) => (
                  <span className="flex ">
                    <p className="px-5 py-2 bg-gray-700 rounded-l-sm">
                      {filter.filterName}
                    </p>
                    <button
                      onClick={() => removeFilter(filter.filterName)}
                      className=" py-2 bg-red-800  rounded-r-md px-2 cursor-pointer"
                    >
                      X
                    </button>
                  </span>
                ))}
              </div>
              <div className=" w-1/2 flex justify-center items-center gap-12">
                <button className="rounded-full  px-5 w-1/4 py-4 self-center border-2 hover:bg-[#35333a]">
                  Featured ⬇️
                </button>
                <button
                  onClick={() => setHideFilter((filter) => !filter)}
                  className="rounded-full  px-5 py-4 w-1/4 self-center border-2 hover:bg-[#35333a]"
                >
                  Hide Filters
                </button>
                <button className="rounded-full  px-5 py-4 w-1/4 self-center border-2 hover:bg-[#35333a]">
                  💫 24 hour delivery
                </button>
              </div>
            </div>
            {/* celebs */}
            <div
              className={`min-h-[80rem]  relative  justify-items-start   grid  ${
                hideFilter
                  ? "lg:grid-cols-3 xl:grid-cols-5   md:grid-cols-2 "
                  : "lg:grid-cols-3 xl:grid-cols-4   md:grid-cols-3"
              } sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-0`}
            >
              {/* celebs */}
              {loading ? (
                <h1>Loading</h1>
              ) : !celebs ? (
                <h1>Error</h1>
              ) : (
                [...celebs]
                  .reverse()
                  .map((celeb) => <CelebCard celeb={celeb} key={celeb.uid} />)
              )}
            </div>
          </div>
        </div>
        {/* filter */}
        <div className="w-[20%] pt-32 ml-10 ">
          {!hideFilter ? (
            <Filter
              originalCelebs={originalCelebs}
              celebs={celebs}
              setCelebs={setCelebs}
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Category;
