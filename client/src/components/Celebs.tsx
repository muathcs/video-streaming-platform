import CelebCard from "./CelebCard";
import background from "../assets/background.jpg";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";
function Celebs() {
  // const { data: getData, loading, error } = useGlobalAxios("getnow");

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

        setCelebs(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getCelebs();
  }, []);

  const navigate = useNavigate();

  const amountOfCelebPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * amountOfCelebPerPage; // 30 is the amount of celebs we want to show per page
  const endIndex = startIndex + amountOfCelebPerPage;
  const celebsToShow = celebs.slice(startIndex, endIndex);
  const [amountOfCategoryToShow, setAmountOfCategoryToShow] =
    useState<number>(6);

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
      <div id="pagex" className=" flex flex-col w-full  items-center gap-10  ">
        <div className=" hidden h-1/2 py-4 w-full  md:flex justify-center flex-col items-center gap-10   ">
          {/* first iamge */}
          <div className="w-2/4 xl:w-2/4       rounded-lg   relative ">
            <img
              src={background}
              className="w-full   rounded-lg xl:h-80"
              alt="Background"
            />
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
              Personalised Videos from your favourite Celebs
            </p>
          </div>

          {/* features */}
          <div className="md:w-4/4 xl:w-3/4  mx-5  h-full rounded-lg overflow-hidden relative md:grid grid-rows-5  gap-4 hidden  p-2  ">
            <div className="row-span-1 text-left">
              <h1>Features</h1>
            </div>
            <div className="row-span-4 grid  grid-cols-4 gap-4  ">
              {[...Array(4)].map((item) => (
                <div className="relative w-full h-full overflow-hidden rounded-md hover:cursor-pointer ">
                  <img
                    src={background}
                    className="w-full rounded-lg h-full"
                    alt="Background"
                  />
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold">
                    Personalised Videos from your favourite Celebs
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shop By Category */}

        <div className=" h-[450px] xl:h-[350px]  md:w-full xl:w-[90%] flex justify-center   w-full lg:mb-40 xl:mb-20  xl:ml-24">
          <div className="w-full flex flex-col">
            <p className="text-left text-[26px] font-serif relative  h-1/6  flex items-end mb-2 justify-center  ">
              Shop By Category
            </p>
            <div className=" md:h-4/6 gap-0 grid  grid-cols-3 sm:grid-cols-5 xl:grid-cols-9 just  px-4  justify-center md:mb-5 xl:gap-20   ">
              {shopByCategory
                .splice(0, amountOfCategoryToShow)
                .map((category, index) => {
                  return (
                    <div
                      key={category.categoryName}
                      className="flex flex-col  items-center justify-center  hover:cursor-pointer hover:text-gray-400 mb-2    "
                    >
                      <div
                        onClick={() =>
                          navigate(`/browse/${category.categoryName}`)
                        }
                        className="border-2 bg-red-300 rounded-full w-[6.5rem] h-[6.5rem] md:w-[8rem]  md:h-[8rem]  lg:w-[11rem] lg:h-[11rem] xl:w-[12rem] xl:h-[12rem] overflow-hidden relative "
                      >
                        <img
                          src={category.img}
                          className="h-full w-full object-cover card-zoom-image"
                        />
                      </div>
                      <p className="font-bold text-sm md:text-[24px] w-full flex justify-center hover:text-gray-400  ">
                        {category.categoryName}
                      </p>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() => {
                setAmountOfCategoryToShow(amountOfCategoryToShow == 8 ? 6 : 8);
              }}
              className=" border-2 border-gray-50   mx-4   rounded-full py-3 hover:bg-gray-950 mt-5 lg:mt-32 xl:mt-10"
            >
              View All
            </button>
          </div>
        </div>

        {/* celebs */}
        <p className=" w-full text-left pl-7 text-2xl md:hidden relative top-8 font-bold">
          Featured
        </p>
        <div className="2xl:w-4/4   relative justify-items-center flex   w-full overflow-scroll   mb-10 pb-2  ">
          <div className="flex flex-row gap-5 pl-5 md:grid md:grid-cols-2  md:w-full  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  p-5 ">
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
        </div>
        <button
          className="bg-gray-800 px-10 py-5 rounded-md relative bottom-10 lg:block hidden"
          onClick={handleNextPage}
        >
          Next Page
        </button>
      </div>
    </>
  );
}

export default Celebs;
