import React from "react";

interface FulfillRequestProps {
  celebReply: string | undefined;
  setCelebReply: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function FulfillMessage({ setCelebReply }: FulfillRequestProps) {
  return (
    <div className="">
      <div className="text-left">Step 3: Reply</div>
      <textarea
        onChange={(e) => setCelebReply(e.target.value)}
        className=" block min-h-[auto] w-full  rounded border my-2 bg-transparent
                     px-2 py-2  h-40 shadow-lg shadow-red-400   outline-none placeholder-style  relative
                      "
        placeholder=""
      />
    </div>
  );
}

export default FulfillMessage;
