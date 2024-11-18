import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import CelebCard from "../components/CelebCard";
import axios from "../api/axios";
import { CelebType } from "../TsTypes/types";
import { apiUrl } from "../utilities/fetchPath";
import Filter from "../components/Filter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import { GiCardKingClubs } from "react-icons/gi";

type TopSectionProps = {
  originalCelebs: CelebType[];
  celebs: CelebType[];
  setCelebs: Dispatch<SetStateAction<CelebType[]>>;
  setSelectedFilters: (arr: any[]) => void;
  selectedFilters: any;
  results: number;
};

function TopSection({
  originalCelebs,
  celebs,
  setCelebs,
  setSelectedFilters,
  selectedFilters,
  results,
}: TopSectionProps) {
  const [sortedCelebs, setSortedCelebs] = useState<CelebType[]>([...celebs]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortCelebsByPrice = (order: "asc" | "desc") => {
    const sortedArray = [...celebs].sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setCelebs(sortedArray);
    setSortedCelebs(sortedArray);
    setSortOrder(order);
  };

  return (
    <div className="flex justify-between relative mb-5   ">
      <div className="w-1/2 flex items-start justify-center gap-5 flex-col  ">
        <p className="text-[24px] text-left ">{results} results</p>
      </div>

      {/* filter */}

      <div className=" w-1/2 flex  items-center gap-12   justify-end ">
        <Select
          onValueChange={(e: "asc" | "desc") => {
            setSortOrder(e);
            sortCelebsByPrice(e);
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className=" cursor-pointer bg-black">
            <SelectItem value="asc">High to Low</SelectItem>
            <SelectItem value="desc">Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type DisplayCelebsForCategoryProps = {
  celebs: CelebType[];
  loading: boolean;
};
function DisplayCelebsForCategory({
  celebs,
  loading,
}: DisplayCelebsForCategoryProps) {
  const { category } = useParams();

  // useEffect(() => {
  //   // setLoading(true);
  //   const fetchCelebsForCategory = async () => {
  //     try {
  //       let response;
  //       if (category == "all") {
  //         response = await axios.get(`${apiUrl}/celebs`);
  //       } else {
  //         response = await axios.get(`${apiUrl}/celebs/category/${category}`);
  //       }

  //       setCelebs(response.data);
  //       setOriginalCelebs(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("error: ", error);
  //     }
  //   };

  //   // return () => {
  //   fetchCelebsForCategory();
  //   // };
  // }, []);

  return (
    <div className=" relative grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  sm:gap-x-20  md:gap-x-4 gap-y-10 md:gap-y-4 w-full  justify-items-center">
      {/* celebs */}
      {loading ? (
        <h1>Loading</h1>
      ) : !celebs ? (
        <h1>Error</h1>
      ) : (
        [...celebs].map((celeb) => <CelebCard celeb={celeb} key={celeb.uid} />)
      )}
    </div>
  );
}
function Category() {
  const { category } = useParams();

  console.log("cat: ", category);

  const [celebs, setCelebs] = useState<CelebType[]>([]);
  const [originalCelebs, setOriginalCelebs] = useState<CelebType[]>([]); // used as a copy for filtering
  const [hideFilter, setHideFilter] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMoreCelebs, setHasMoreCelebs] = useState<Boolean>(true);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  // function removeFilter(filterName: string) {
  //   const newFilter = selectedFilters.filter(
  //     (filter) => filter.filterName != filterName
  //   );

  //   setSelectedFilters(newFilter);
  // }

  // get all the celebs that match the param
  useEffect(() => {
    // setLoading(true);
    const fetchCelebs = async () => {
      try {
        let response;
        if (category == "all") {
          response = await axios.get(`${apiUrl}/celebs`, {
            params: {
              page: page,
              pageSize: 20,
            },
          });
        } else {
          response = await axios.get(`${apiUrl}/celebs/category/${category}`, {
            params: {
              page: page,
              pageSize: 10,
            },
          });
        }

        // If the response has fewer items than the page size, stop pagination
        if (response.data.length < 10) {
          setHasMoreCelebs(false);
        } else {
          setHasMoreCelebs(true);
        }
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
  }, [page]);

  // Function to scroll to the top of the page
  // Function to scroll to the top of the page with slower animation
  // Function to scroll to 25% from the top of the page with slower animation
  const scrollToTop = useCallback(() => {
    const targetPosition = window.innerHeight * 0.25; // 25% from the top
    const scrollDuration = 1000; // Duration in ms
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition; // Total distance to scroll
    const startTime = performance.now(); // Start time for the animation

    const scroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / scrollDuration, 1); // Normalize progress (0 to 1)
      const easeInOut = (t: number) =>
        t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Easing function
      const scrollStep = distance * easeInOut(progress);

      window.scrollTo(0, startPosition + scrollStep);

      if (progress < 1) {
        requestAnimationFrame(scroll); // Continue the animation
      }
    };

    requestAnimationFrame(scroll); // Start the animation
  }, []);

  return (
    <div className="flex justify-center relativ bg-black py-20 flex-col items-center gap-5">
      <div className="flex  relative top-10  w-4/5  ">
        <div className="w-full ">
          <h1 className="text-left">{category}</h1>
          <div className="   ">
            {/* top section */}
            <TopSection
              originalCelebs={originalCelebs}
              celebs={celebs}
              setCelebs={setCelebs}
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
              results={celebs.length}
            />
            {/* celebs */}
            <DisplayCelebsForCategory celebs={celebs} loading={loading} />
          </div>
        </div>
        {/* filter */}
        {/* <div className="w-[20%] pt-32 ml-10 ">
          {!hideFilter ? (
            <Filter
              originalCelebs={originalCelebs}
              celebs={celebs}
              setCelebs={setCelebs}
              setSelectedFilters={setSelectedFilters}
              selectedFilters={selectedFilters}
            />
          ) : null}
        </div> */}
      </div>
      <div className="">
        {page > 1 && (
          <button
            // disabled={hasMoreCelebs} // Disable button if no more celebs
            disabled={page == 1 ? true : false}
            onClick={() => {
              setPage((currentPage) => currentPage - 1);
              scrollToTop();
            }}
            className={`py-4 w-40 bg-gray-700 hover:bg-gray-800 rounded-md mt-10 mr-2 ${
              page == 1 && "cursor-not-allowed opacity-50"
            }`}
          >
            previous
          </button>
        )}
        <button
          onClick={() => {
            setPage((prevPage) => prevPage + 1);
            scrollToTop();
          }}
          className={`py-4 w-40 bg-gray-700 hover:bg-gray-800 rounded-md mt-10 ${
            !hasMoreCelebs && "cursor-not-allowed opacity-50"
          }`}
          disabled={!hasMoreCelebs} // Disable button if no more celebs
        >
          {hasMoreCelebs ? "Next" : "No More Celebs"}
        </button>
      </div>
    </div>
  );
}

export default Category;
