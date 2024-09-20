import React from "react";
import { Skeleton } from "../ui/skeleton";

function FanRequestSkeleton() {
  return (
    <Skeleton className="relative flex p-5 flex-col items-center md:flex-row md:w-1/2 rounded-lg bg-slate-900">
      {/* Skeleton for image */}
      <div className="w-1/3 h-[350px]">
        <Skeleton className="w-full h-full rounded-lg bg-slate-700" />
      </div>

      {/* Right-side skeleton content */}
      <div className="flex-1 ml-5">
        <div className="h-[250px]">
          {/* Skeleton for "Your Request to {celebName} is {reqstatus}" */}
          <p className="text-lg flex items-center gap-2">
            <Skeleton className="h-6 w-[200px] bg-slate-700" />{" "}
            {/* Celeb name and status */}
            <Skeleton className="h-6 w-6 bg-slate-700 rounded-full" />{" "}
            {/* BsQuestionCircle icon */}
          </p>

          {/* Skeleton for fulfilled or pending request */}
          <span className="absolute bottom-0 right-0 w-1/2 h-1/2">
            <Skeleton className="h-24 w-24 bg-slate-700 rounded-full" />{" "}
            {/* FulfilledRequest or Pending icon */}
            <Skeleton className="h-8 w-32 bg-slate-700 rounded-lg absolute bottom-5 right-2" />{" "}
            {/* Expected delivery date */}
          </span>
        </div>
      </div>
    </Skeleton>
  );
}

export default FanRequestSkeleton;
