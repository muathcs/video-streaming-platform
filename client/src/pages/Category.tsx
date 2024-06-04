import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

  console.log(sortOrder);

  return (
    <div className="flex justify-between relative mb-5  ">
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
          <SelectContent className="bg-red-400 cursor-pointer">
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

  console.log("celebs: ", celebs);

  return (
    <div className=" relative grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2  sm:gap-x-20  md:gap-x-4 gap-y-10 md:gap-y-4 w-full  justify-items-center">
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
  );
}
function Category() {
  const { category } = useParams();

  console.log("cat: ", category);

  const [celebs, setCelebs] = useState<CelebType[]>([]);
  const [originalCelebs, setOriginalCelebs] = useState<CelebType[]>([]); // used as a copy for filtering
  const [hideFilter, setHideFilter] = useState<Boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  function removeFilter(filterName: string) {
    const newFilter = selectedFilters.filter(
      (filter) => filter.filterName != filterName
    );

    setSelectedFilters(newFilter);
  }

  // get all the celebs that match the param
  useEffect(() => {
    // setLoading(true);
    const fetchCelebs = async () => {
      try {
        let response;
        if (category == "all") {
          response = await axios.get(`${apiUrl}/celebs`);
        } else {
          response = await axios.get(`${apiUrl}/celebs/category/${category}`);
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
  }, []);

  return (
    <div className="flex justify-center relative top-10 h-full   ">
      <div className="flex  relative top-10 h-full w-4/5  ">
        <div className="w-full ">
          <h1 className="text-left">{category}</h1>
          <div className=" h-full    ">
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
    </div>
  );
}

export default Category;
