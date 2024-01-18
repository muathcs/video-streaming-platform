import { useContext } from "react";
import CelebCard from "./CelebCard";
import { useGlobalAxios } from "../hooks/useGlobalAxios";
import background from "../assets/background.jpg";
import { RequestContext } from "../context/RequestContext";
import { useNavigate } from "react-router-dom";
function Celebs() {
  const { data, loading, error } = useGlobalAxios(
    "get",
    "http://localhost:3001/celebs"
  );

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
      categoryName: "Reality TV",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/jeremy.jpg",
    },
    {
      categoryName: "Business",
      img: "https://cy-vide-stream-imgfiles.s3.eu-west-2.amazonaws.com/categories/peter.jpg",
    },
    {
      categoryName: "View All",
      img: "",
    },
  ];

  const { requests } = useContext(RequestContext);

  const navigate = useNavigate();

  console.log("here", requests);
  return (
    <>
      <div className=" flex flex-col  items-center">
        <div className="h-[24%]   py-4 w-full flex justify-center flex-col items-center gap-10 ">
          {/* first iamge */}
          <div className="w-3/4  h-2/3 rounded-lg overflow-hidden relative">
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

        <div className=" h-[15%] w-3/4 flex justify-center  px-10 ">
          <div className="w-full flex flex-col">
            <p className="text-left text-[26px] font-serif relative  h-1/6  flex items-end mb-2">
              Shop By Category
            </p>
            <div className=" h-4/6   gap-0 grid  sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
              {shopByCategory.map((category) => (
                <div className="flex flex-col  items-center justify-center hover:cursor-pointer hover:text-gray-400  ">
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
        <div className="w-3/4   relative px-20 justify-items-center overflow-auto  grid  lg:grid-cols-3 xl:grid-cols-4   md:grid-cols-3 sm:grid-cols-2 sm:gap-x-52 md:gap-x-64 lg:gap-30  ">
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
      </div>
    </>
  );
}

export default Celebs;
