import CelebCard from "./CelebCard";
import background from "../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";
function Celebs() {
  // const { data: getData, loading, error } = useGlobalAxios("getnow");

  console.log("on celebs");

  const [celebs, setCelebs] = useState<CelebType[]>([]);

  const shopByCategory = [
    {
      categoryName: "Actors",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/idris.jpg",
    },
    {
      categoryName: "Footballers",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/son.jpeg",
    },
    {
      categoryName: "Comedians",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/jack-whitehall.jpg",
    },
    {
      categoryName: "Kids",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/sponge-bob.png",
    },
    {
      categoryName: "Athletes",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/mo-farah.jpg",
    },
    {
      categoryName: "Reality-TV",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/jeremy.jpg",
    },
    {
      categoryName: "Business",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/peter.jpg",
    },
    {
      categoryName: "all",
      img: "",
    },
  ];

  // fetches celeb on mount
  useEffect(() => {
    const getCelebs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/celebs`);

        console.log("res: ", response);
        setCelebs(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getCelebs();
  }, []);

  const navigate = useNavigate();

  // console.log("data: ", data);

  const amountOfCelebPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * amountOfCelebPerPage; // 30 is the amount of celebs we want to show per page
  const endIndex = startIndex + amountOfCelebPerPage;
  const celebsToShow = celebs.slice(startIndex, endIndex);

  const handleNextPage = () => {
    // window.scrollTo({ top: 10, behavior: "smooth" });
    // document.querySelector("body")?.scrollTo(0, 0);
    // window.scrollTo(0, 0);
    // document
    //   .getElementById("pagex")
    //   ?.scrollTo({ top: 880, behavior: "smooth" });
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <div id="pagex" className=" flex flex-col  items-center gap-10   ">
        <div className="h-[845px] py-4 w-full  flex justify-center flex-col items-center gap-10  ">
          {/* first iamge */}
          <div className="w-3/4  h-2/3 rounded-lg overflow-hidden relative ">
            <img src={background} className="w-full" alt="Background" />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
              Personalised Videos from your favourite Celebs
            </p>
          </div>

          {/* features */}
          <div className="w-3/4  h-full rounded-lg overflow-hidden relative grid grid-rows-5  gap-4    ">
            <div className="row-span-1 text-left">
              <h1>Features</h1>
            </div>
            <div className="row-span-4 grid  grid-cols-4 gap-4">
              <div className="relative w-4/4 h-4/5 overflow-hidden rounded-md hover:cursor-pointer">
                <img
                  src={background}
                  className="w-full rounded-lg"
                  alt="Background"
                />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
                  Personalised Videos from your favourite Celebs
                </p>
              </div>
              <div className="relative w-4/4 h-4/5  overflow-hidden rounded-md hover:cursor-pointer  ">
                <img
                  src={background}
                  className="w-full rounded-lg"
                  alt="Background"
                />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
                  Personalised Videos from your favourite Celebs
                </p>
              </div>
              <div className="relative w-4/4 h-4/5  overflow-hidden rounded-md hover:cursor-pointer">
                <img
                  src={background}
                  className="w-full rounded-lg"
                  alt="Background"
                />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
                  Personalised Videos from your favourite Celebs
                </p>
              </div>
              <div className="relative w-4/4 h-4/5  overflow-hidden rounded-md hover:cursor-pointer">
                <img
                  src={background}
                  className="w-ful rounded-lgl"
                  alt="Background"
                />
                <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
                  Personalised Videos from your favourite Celebs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop By Category */}

        <div className=" h-[450px]  w-3/4 flex justify-center  px-10 ">
          <div className="w-full flex flex-col">
            <p className="text-left text-[26px] font-serif relative  h-1/6  flex items-end mb-2">
              Shop By Category
            </p>
            <div className=" h-4/6   gap-0 grid  sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
              {shopByCategory.map((category) => (
                <div
                  key={category.categoryName}
                  className="flex flex-col  items-center justify-center hover:cursor-pointer hover:text-gray-400  "
                >
                  <div
                    onClick={() => navigate(`/browse/${category.categoryName}`)}
                    className="border-2 bg-red-300 rounded-[50%] w-52 h-52 overflow-hidden relative"
                  >
                    <img
                      src={category.img}
                      className="h-full w-full object-cover card-zoom-image"
                    />
                  </div>
                  <p className="font-bold text-[24px] w-full flex justify-center hover:text-gray-400  ">
                    {category.categoryName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* celebs */}
        <div className="w-3/4   relative px-20 justify-items-center   grid  lg:grid-cols-3 xl:grid-cols-4   md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-30  ">
          {0 ? (
            <h1>Loading</h1>
          ) : 0 ? (
            <h1>Error</h1>
          ) : (
            [...celebsToShow]
              .reverse()
              .map((celeb, index) => <CelebCard celeb={celeb} key={index} />)
          )}
        </div>
        <button
          className="bg-gray-800 px-10 py-5 rounded-md relative bottom-10"
          onClick={handleNextPage}
        >
          Next Page
        </button>
      </div>
    </>
  );
}

export default Celebs;
