import React, { useEffect, useState } from "react";

function Filter({
  originalCelebs,
  celebs,
  setCelebs,
  setSelectedFilters,
  selectedFilters,
}: any) {
  const [rangeValue, setRangeValue] = useState(20);
  const [lowToHighCheck, setLowToHighCheck] = useState<boolean | undefined>(
    false
  );
  const [highToLowCheck, setHighToLowCheck] = useState<boolean | undefined>(
    false
  );

  // this sets the value of the radio buttons, because there are to ways to remove filters, this function checks if the selectedFilter have been updated from the
  // category's compmonent removeFilter function.
  useEffect(() => {
    // This effect will run whenever selectedFilters changes
    const checkHigh = selectedFilters.some((filter: any) => {
      return filter.filterName === "high-to-low" && filter.visible === true;
    });

    const checkLow = selectedFilters.some((filter: any) => {
      return filter.filterName === "low-to-high" && filter.visible === true;
    });

    // Update highToLowCheck state based on the check value
    setHighToLowCheck(checkHigh);
    setLowToHighCheck(checkLow);
  }, [selectedFilters]);

  function handleRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRangeValue(parseInt(e.target.value, 10));
  }

  function handleFilters(filterType: string, filterName: string) {
    const updatedArr = [...selectedFilters];

    const ObjectToUpdate = updatedArr.find(
      (obj) => obj.filterType == filterType
    );

    if (ObjectToUpdate) {
      ObjectToUpdate.filterName = filterName;
      ObjectToUpdate.visible = true;
      setSelectedFilters(updatedArr);
    } else {
      setSelectedFilters([
        ...selectedFilters,
        { filterType: filterType, filterName: filterName, visible: true },
      ]);
    }
  }

  // should probably put the below functions into one function and add a swithc statement.

  function filterLowToHigh() {
    setLowToHighCheck(true);
    setHighToLowCheck(false);

    let newState = [...celebs];

    handleFilters("price", "low-to-high");

    newState = newState.slice().sort((a, b) => b.price - a.price);
    setCelebs(newState);
  }

  function highToLow() {
    setHighToLowCheck(true);
    setLowToHighCheck(false);

    handleFilters("price", "high-to-low");
    let newState = [...celebs];
    newState = newState.slice().sort((a, b) => a.price - b.price);
    setCelebs(newState);
  }

  function filterPrice() {
    let newState = [...originalCelebs];

    newState = newState.filter((celeb) => celeb.price > rangeValue);

    setCelebs(newState);
  }

  function resetPrice() {
    setCelebs(originalCelebs);
    setRangeValue(() => {
      return 10;
    });
    setHighToLowCheck(false);
    setLowToHighCheck(false);
    setSelectedFilters([]);
  }
  return (
    <div className="w-full  ">
      <details
        open
        className=" max-w-md  overflow-hidden rounded-lg    open:shadow-lg text-gray-700"
      >
        <summary className="flex cursor-pointer select-none items-center justify-between  px-5 py-3 lg:hidden">
          <span className="text-sm font-medium"> Toggle Filters </span>

          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </summary>

        <form
          action=""
          className="flex flex-col justify-center items-center text-white   "
        >
          <fieldset className="w-full flex justify-center cursor-pointer border-b border-purple-600 shadow-lg">
            <legend className="block w-full  px-5 py-3 text-lg font-medium">
              Price
            </legend>

            <div className="space-y-2 px-5 py-6  cursor-pointer">
              <div className="flex items-center">
                <input
                  id="low-to"
                  type="radio"
                  name="low-to"
                  checked={lowToHighCheck}
                  onClick={filterLowToHigh}
                  // className="h-5 w-5 rounded border-gray-300 bg-yellow-400  cursor-pointer"
                  className="peer h-5 w-5 cursor-pointer"

                  // checked
                />

                <label htmlFor="low-to" className="ml-3 text-lg font-medium  ">
                  low to high
                </label>
              </div>

              <div className="flex items-center ">
                <input
                  id="high-to"
                  type="radio"
                  name="low-to"
                  checked={highToLowCheck}
                  onClick={highToLow}
                  className="peer h-5 w-5 cursor-pointer"
                />

                <label htmlFor="high-to" className="ml-3 text-lg font-medium">
                  high to low
                </label>
              </div>

              <div className="flex  flex-col items-center">
                <input
                  id="default-range"
                  type="range"
                  value={rangeValue}
                  max={300}
                  onChange={(e) => {
                    filterPrice();
                    handleRangeChange(e);
                  }}
                  className="w-full h-5   rounded-lg appearance-none cursor-pointer dark:bg-gray-700 "
                />
                ${rangeValue}.00
                <label htmlFor="Branded" className="ml-3 text-lg font-medium">
                  Custom
                </label>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetPrice}
                  type="button"
                  className="text-xs text-gray-500 underline"
                >
                  Reset Type
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset className="w-full">
            <legend className="block w-full  px-5 py-3 text-lg font-medium">
              Filter
            </legend>

            <div className="space-y-2 px-5 py-6 border-b border-purple-600">
              <div className="flex items-center">
                <input
                  id="300+"
                  type="radio"
                  name="Price"
                  value="300+"
                  className="h-5 w-5 rounded "
                />

                <label htmlFor="300+" className="ml-3 text-sm font-medium">
                  24 hour delivery
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="600+"
                  type="radio"
                  name="Price"
                  value="600+"
                  className="h-5 w-5 rounded "
                />

                <label htmlFor="600+" className="ml-3 text-sm font-medium">
                  5 star reviews
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="1500+"
                  type="radio"
                  name="Price"
                  value="1500+"
                  className="h-5 w-5 rounded "
                  checked
                />

                <label htmlFor="1500+" className="ml-3 text-sm font-medium">
                  Most Popular
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="text-xs text-gray-500 underline"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </fieldset>
        </form>
        <div className="">
          <div className="flex justify-between   px-5 py-3">
            <button
              name="reset"
              type="button"
              className="rounded text-xs font-medium text-gray-600 underline"
            >
              Reset All
            </button>
          </div>
        </div>
      </details>
    </div>
  );
}

export default Filter;
