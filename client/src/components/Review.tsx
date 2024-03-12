import React from "react";

type ReviewProps = {
  rating: number;
  name: string;
  date: Date;
  event?: string;
  message: string;
};

function Review({ message, rating, date, event, name }: ReviewProps) {
  const originalDate = new Date(date);

  const formattedDate = `${originalDate.getFullYear()}-${(
    originalDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${originalDate.getDate().toString().padStart(2, "0")}`;

  return (
    <>
      <div className="bg-[#201E23] min-h-[250px] h-auto   rounded-xl px-5 py-5 pb-8 w-full my-2">
        <div className="text-left relative ">
          <h1 className="text-lg">
            {name}
            <span className="left-3 relative">{"⭐".repeat(rating)}</span>
          </h1>
          <p>{formattedDate}</p>
        </div>
        <div className="relative top-2 text-gray-300 text-left  ">
          {message}
        </div>
      </div>
    </>
  );
}

export default Review;
