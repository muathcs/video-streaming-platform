import CelebCard from "../components/CelebCard";
import background from "../assets/background.jpg";
import { useInRouterContext, useNavigate } from "react-router-dom";
import { apiUrl } from "../utilities/fetchPath";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { AuthContextType, CelebType } from "../TsTypes/types";
import { useAuth } from "../context/AuthContext";
import { userInfo } from "os";
import CelebSpiderImg from "../assets/spider.png";
import messi from "../assets/messi.png";
import picks1 from "../assets/picks1.png";
import picks2 from "../assets/picks2.png";
import picks3 from "../assets/picks3.png";
import { cn } from "@/lib/utils";
import { GoArrowUpRight } from "react-icons/go";
import instructionMan from "../assets/instruction-man.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Footer() {
  return (
    <div className="w-full flex justify-center    bg-black border-t-[0.5px] border-gray-600 py-5   ">
      <div className="max-w-7xl w-full px-4">
        <div className="text-center">
          {/* Branding */}
          <p className="bg-gradient-to-r from-[#BA58E8] to-white text-transparent bg-clip-text mb-4 text-xl font-semibold">
            Cameo
          </p>
          {/* Slogan */}
          <p className="w-full md:w-80 mx-auto text-lg font-semibold leading-6">
            Get Personal Shoutouts from Celebrities, Made Just for You!
          </p>

          {/* Call to Action */}
          <div className="mt-4">
            <button className="bg-gradient-to-r from-[#BA58E8] to-[#6258E8] rounded-full py-2 px-6 font-semibold mr-4 hover:shadow-lg transition">
              Join as Talent
            </button>
            <button className="bg-gradient-to-r from-[#BA58E8] to-[#6258E8] rounded-full py-2 px-6 font-semibold hover:shadow-lg transition">
              Log in
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold">Trusted by Thousands</h3>
            <p className="mt-2 text-sm text-gray-600">
              Join over 50,000 satisfied users who have received personal
              shoutouts from their favorite celebrities.
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-10 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
            <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
              About Us
            </a>
            <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
              Help Center
            </a>
            <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
              Privacy Policy
            </a>
            <a href="#" className="text-sm font-semibold hover:text-[#BA58E8]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
function Celebs() {
  // const { data: getData, loading, error } = useGlobalAxios("getnow");

  const [celebs, setCelebs] = useState<CelebType[]>([]);

  const { currentUser }: AuthContextType = useAuth();

  console.log("current: ", currentUser);

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

  const instructions = [
    {
      instructionTitle: "Find a Celebrity",
      instruction: "Browse thousands of stars offering  personalized videos.",
    },
    {
      instructionTitle: "Tell them what to say",
      instruction:
        "During checkout, you’ll provide the details the celeb will need to make the perfect personalized video.",
    },
    {
      instructionTitle: "Get your video",
      instruction:
        "Celebs have up to 7 days to complete your request. When it’s ready, we’ll send it directly to you.",
    },
    {
      instructionTitle: "Share with loved ones",
      instruction:
        "Send the video to friends and family and don’t forget to capture their priceless reactions.",
    },
  ];

  const faqData = [
    {
      question: "What is Cameo?",
      answer:
        "Cameo is a platform where you can get personalized video shoutouts from celebrities.",
    },
    {
      question: "How do I request a video?",
      answer:
        "Simply browse through the celebrities, choose your favorite, and send a request with the details of your shoutout.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Prices vary depending on the celebrity. You can view the price before requesting a shoutout.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Refunds are available if the celebrity doesn’t complete your request within 7 days.",
    },
    {
      question: "Can I share my video on social media?",
      answer:
        "Yes, once you receive your video, it's yours to share across all your social media platforms.",
    },
  ];

  // fetches celeb on mount
  useEffect(() => {
    const getCelebs = async () => {
      try {
        const response = await axios.get(`${apiUrl}/celebs`);
        setCelebs(response.data);
      } catch (error:any) {
            // Handle errors (error.response is the response from the server)
            if (error.response) {
              // Server responded with a status other than 200 range
              console.error('Error occurredx:', error.response.data); // Log server error message
              // alert(`An error occurred: ${error.response.data.error}`);
          } else {
              // Other errors (e.g., network errors)
              console.error('Error occurredy:', error.message);
              // alert(`An error occurred: ${error.message}`);
          }
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
  const { userInfo }: AuthContextType = useAuth();
  const [recommendations, setRecommendations] = useState<CelebType[]>();

  const handleNextPage = () => {
    // window.scrollTo({ top: 10, behavior: "smooth" });
    // document.querySelector("body")?.scrollTo(0, 0);
    // window.scrollTo(0, 0);
    // document
    //   .getElementById("pagex")
    //   ?.scrollTo({ top: 880, behavior: "smooth" });
    setCurrentPage((prevPage) => prevPage + 1);
  };

  async function getRecommendations() {
    try {
      const response = await axios.get(
        `${apiUrl}/celebs/rec/${userInfo?.fav_categories}`
      );

      setRecommendations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (userInfo?.fav_categories) {
      getRecommendations();
    }
  }, []);

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [startIndexx, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const handleNext = () => {
    console.log("handle next");
    if (startIndexx + itemsPerPage < items.length) {
      console.log("inside next");
      setStartIndex(startIndexx + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndexx > 0) {
      setStartIndex(startIndexx - 1);
    }
  };

  const visibleItems = items.slice(startIndexx, startIndexx + itemsPerPage);

  console.log("visible: ", visibleItems);

  return (
    <>
      <div className=" flex flex-col w-full items-center gap-10  gradiant-page">
        <div className=" hidden h-1/2 py-4 w-full  md:flex justify-center flex-col items-center gap-10   max-w-7xl relative ">
          {/* Top Section */}
          <div className="max-w-7xl w-full h-auto rounded-lg mt-4 relative">
            <p className="text-7xl  font-serif text-white mt-20 mb-10">
              <span className="text-purple-500">Personalized </span> Videos
              <br />
              From Your Favorite <span className="text-purple-500">Stars</span>
            </p>
            <p className="text-2xl  font-serif text-white ">
              Make Your Unforgettable Moments with Celebrities 🎉
            </p>
            {/* <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
              Make Your Unforgettable Moments with Celebrities 🎉
            </p> */}
          </div>

          {/* celeb Spider */}

          <div className="">
            <img className="object-cover w-full h-full" src={CelebSpiderImg} />
          </div>
        </div>

        {/* Shop By Category */}

        <div className=" max-w-7xl  md:w-full xl:w-[90%] flex justify-center   w-full lg:mb-40 xl:mb-20  xl:ml-24 mb-10">
          <div className="w-full flex flex-col md:mt-0 mt-20  ">
            <p className=" text-[26px] font-serif relative  h-1/6  flex items-end mb-2 justify-center    ">
              Personalized videos from your favorite stars
            </p>
            <div className=" flex flex-wrap justify-center pl-10  items-center gap-0 px-4 md:mb-5 md:gap-5  ">
              {shopByCategory
                .splice(0, amountOfCategoryToShow)
                .map((category, index) => {
                  return (
                    <div
                      key={category.categoryName}
                      className="flex flex-col items-center justify-center hover:cursor-pointer hover:text-gray-400 mb-2"
                    >
                      <div
                        onClick={() =>
                          navigate(`/browse/${category.categoryName}`)
                        }
                        className="border-2 border-[#BA58E8] rounded-full w-[4.5rem] h-[4.5rem] md:w-[6rem] md:h-[6rem] lg:w-[8rem] lg:h-[8rem] xl:w-[10rem] xl:h-[10rem] overflow-hidden relative"
                      >
                        <img
                          src={category.img}
                          className="h-full w-full object-cover card-zoom-image"
                        />
                      </div>
                      <p className="font-thin text-sm mt-1 md:text-[24px] w-full flex justify-center hover:text-gray-600 text-gray-400">
                        {category.categoryName}
                      </p>
                    </div>
                  );
                })}
            </div>
            {/* <div className=" md:h-4/6 gap-0 grid  grid-cols-3 sm:grid-cols-5 xl:grid-cols-9 justify-items-center just  px-4  justify-center items-center md:mb-5 xl:gap-20 border-2  ">
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
            </div> */}
            <button
              onClick={() => {
                setAmountOfCategoryToShow(amountOfCategoryToShow == 8 ? 6 : 8);
              }}
              className={cn(
                "border w-1/2 border-gray-50 mx-auto relative rounded-full py-4  bg-gradient-to-r from-fuchsia-400 to-indigo-500 transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg",
                amountOfCategoryToShow === 8 ? "mt-auto top-auto " : ""
              )}
            >
              {amountOfCategoryToShow == 8 ? "Show Less" : "View More"}
            </button>
          </div>
        </div>

        {/* Features picks */}

        <div className="sm:grid sm:grid-cols-5   pt-20 w-full max-w-4xl gap-2 flex flex-col px-1 ">
          <div className="col-span-3  h-[333px] bg-gradient-to-b  from-[#392D57] to-[#24222B]  rounded-xl ">
            <img className="w-full h-full " src={messi} />
          </div>
          <div className="col-span-2 bg-gradient-to-b  from-[#392D57] to-[#24222B]  rounded-xl flex flex-col items-start justify-end pl-10 pb-20  hover:cursor-pointer h-[333px]  ">
            <p className="bg-gradient-to-r from-fuchsia-400 to-white text-transparent bg-clip-text font-thin text-2xl relative bottom-5  ">
              Best <br /> Sellers
            </p>

            <div className="bg-gradient-to-r from-fuchsia-400 to-white rounded-3xl p-0.5 ">
              <button className=" py-2 w-20  text-center flex rounded-3xl items-center  justify-center  border-2 border-transparent bg-clip-border  ">
                <GoArrowUpRight size={30} />
              </button>
            </div>
          </div>
          <div className="col-span-2 rounded-xl flex flex-col items-start justify-end pl-10 pb-20   hover:cursor-pointer h-[333px] bg-gradient-to-b  from-[#392D57] to-[#24222B] ">
            <p className="bg-gradient-to-r from-fuchsia-400 to-white text-transparent bg-clip-text font-thin text-2xl relative  bottom-5  ">
              Best <br /> Sellers
            </p>

            <div className="bg-gradient-to-r from-fuchsia-400 to-white rounded-3xl p-0.5">
              <button className=" py-2 w-20  text-center flex rounded-3xl items-center  justify-center  border-2 border-transparent bg-clip-border bg-[#392D57] hover:bg-[#43385f]">
                <GoArrowUpRight size={30} />
              </button>
            </div>
          </div>
          <div className="col-span-3 bg-gradient-to-b  from-[#392D57] to-[#24222B]  rounded-xl flex flex-col items-start justify-end pl-10 pb-20  hover:cursor-pointer h-[333px] ">
            <p className="bg-gradient-to-r from-fuchsia-400 to-white text-transparent bg-clip-text font-thin text-2xl relative bottom-5  ">
              Best <br /> Sellers
            </p>

            <div className="bg-gradient-to-r from-fuchsia-400 to-white rounded-3xl p-0.5">
              <button className=" py-2 w-20  text-center flex rounded-3xl items-center  justify-center  border-2 border-transparent bg-clip-border bg-[#392D57] hover:bg-[#43385f]">
                <GoArrowUpRight size={30} />
              </button>
            </div>
          </div>
        </div>

        {/* Top 10 */}

        <div className="max-w-7xl h-10 w-full flex flex-col mb-80 relative px-2">
          <Carousel className=" mb-20 ">
            <div className="w-full  h-10 relative  mb-5 flex items-center ">
              <p className="text-xl font-semibold ">Today's Top Picks</p>
              <div className="absolute right-16 top-5 ">
                <CarouselPrevious className="  bg-[#1C1C1F] w-10 h-10 border-gray-600  " />
                <CarouselNext className="bg-[#1C1C1F]  w-10 h-10  border-gray-600" />
              </div>
            </div>
            <CarouselContent>
              {celebs.map((celeb, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/1 md:basis-1/2 lg:basis-1/5"
                >
                  <CelebCard celeb={celeb} key={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Recommendations */}
        {userInfo?.fav_categories ? (
          <div className=" h-[450px] xl:h-[350px]  md:w-full xl:w-[90%] flex justify-center   w-full lg:mb-40 xl:mb-20  xl:ml-24 px-2">
            <div className="w-full flex flex-col">
              <p className="text-left text-[26px] font-serif relative  h-1/6  flex items-end mb-2 justify-center  ">
                recommendations
              </p>
              <div className=" md:h-4/6 gap-0 grid  grid-cols-3 sm:grid-cols-5 xl:grid-cols-5 just  px-4  justify-center md:mb-5 xl:gap-20  ">
                {recommendations?.map((celeb, index) => {
                  return (
                    <div
                      key={celeb.celebid}
                      className="flex flex-col  items-center justify-center  hover:cursor-pointer hover:text-gray-400 mb-2    "
                    >
                      <div
                        onClick={
                          () => {
                            navigate("/profile", {
                              state: { celeb },
                            });
                          }
                          // navigate(`/browse/${cele.categoryName}`)
                        }
                        className="border-2 bg-red-300 rounded-full w-[6.5rem] h-[6.5rem] md:w-[8rem]  md:h-[8rem]  lg:w-[11rem] lg:h-[11rem] xl:w-[12rem] xl:h-[12rem] overflow-hidden relative "
                      >
                        <img
                          src={celeb.imgurl}
                          className="h-full w-full object-cover card-zoom-image"
                        />
                      </div>
                      <p className="font-bold text-sm md:text-[24px] w-full flex justify-center hover:text-gray-400  ">
                        {celeb.displayname}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* <button
                onClick={() => {
                  setAmountOfCategoryToShow(
                    amountOfCategoryToShow == 8 ? 6 : 8
                  );
                }}
                className=" border-2 border-gray-50   mx-4   rounded-full py-3 hover:bg-gray-950 mt-5 lg:mt-32 xl:mt-10"
              >
                View All
              </button> */}
            </div>
          </div>
        ) : null}

        {/* celebs */}
        {/* <p className=" w-full text-left pl-7 text-2xl md:hidden relative top-8 font-bold mt-10">
          Featured
        </p>
        <div className="2xl:w-5/6   relative justify-items-center flex   w-full overflow-scroll xl:overflow-auto   mb-10 pb-2 mt-20  ">
          <div className="flex flex-row gap-5 pl-5 md:grid md:grid-cols-2  md:w-full  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  p-5 ">
            {0 ? (
              <h1>Loading</h1>
            ) : 0 ? (
              <h1>Error</h1>
            ) : (
              [...celebsToShow].map((celeb, index) => (
                <CelebCard celeb={celeb} key={index} />
              ))
            )}
          </div>
        </div>
        <button
          className="bg-gray-800 px-10 py-5 rounded-md relative bottom-10 lg:block hidden"
          onClick={handleNextPage}
        >
          Next Page
        </button> */}

        <div className="relative mt-60 w-full max-w-7xl flex flex-col justify-center items-center gap-y-4 px-2">
          <p className="text-4xl font-serif mb-10">Featured Picks</p>

          <img src={picks1} />
          <img src={picks2} />
          <img src={picks3} />
        </div>

        <div className="  px-2 w-full flex flex-col items-center justify-center">
          <p className="font-serif text-2xl text-center">How Cameo Work</p>
          <div className="md:p-10 sm:grid sm:grid-cols-2 gap-4  flex flex-col items-center sm:items-start  ">
            {instructions.map((instruction, index) => (
              <div className="flex flex-col md:w-[375px] items-center justify-center px-2">
                <img
                  src={instructionMan}
                  height={100}
                  className="object-contain bg-[#202021] rounded-lg p-10 w-full sm:w-[375px] h-[220px] border border-[#69696A]"
                />
                <div className="flex flex-row items-center px-2 mt-4  ">
                  <p className="border rounded-full h-[35px] w-[35px] p-5 flex items-center justify-center bg-gradient-to-r from-[#BA58E8]   to-[#6258E8]">
                    {index + 1}
                  </p>
                  <div className="flex flex-col ml-3 ">
                    <h2 className="text-xl font-bold mb-2">
                      {instruction.instructionTitle}
                    </h2>
                    <p>{instruction.instruction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}

        <div className="max-w-7xl  w-full flex flex-col  relative px-2">
          <Carousel className=" mb-20 ">
            <div className="w-full  h-10 relative  mb-5 flex items-center ">
              <p className="text-xl font-semibold ">Today's Top Picks</p>
              <div className="absolute right-16 top-5 ">
                <CarouselPrevious className="  bg-[#1C1C1F] w-10 h-10 border-gray-600  " />
                <CarouselNext className="bg-[#1C1C1F]  w-10 h-10  border-gray-600" />
              </div>
            </div>
            <CarouselContent>
              {[...Array(10)].map((review, index) => (
                <CarouselItem
                  key={index}
                  className=" sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="bg-[#201E23] min-h-[250px] h-auto   rounded-xl px-5 py-5  w-full my-2">
                    <div className="text-left relative ">
                      <h1 className="text-lg">Birthday message from Ronaldo</h1>
                      <p className="flex ">
                        <h1 className="text-lg text-gray-400">Muath</h1>
                        <span className="left-3 relative ">
                          {"⭐".repeat(5)}
                        </span>
                      </p>
                    </div>
                    <div className="relative top-2 text-gray-400 text-left  italic font-serif ">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Facilis corrupti maiores, voluptatem nesciunt repudiandae
                      eligendi praesentium voluptatum, dolor officia eius nihil
                      rerum quos error fugit!
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* FAQs */}
        <div className="mb-20 max-w-7xl w-full px-2">
          <h1 className="text-4xl text-center mb-5">FAQs</h1>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default Celebs;
