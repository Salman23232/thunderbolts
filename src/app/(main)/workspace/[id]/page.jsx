import Chatview from "@/components/custom/Chatview";
import Codeview from "@/components/custom/Codeview";
import Header from "@/components/custom/Header";
import React from "react";

const Page = () => {
  return (
    <div className="p-2 bg-black scrollbar-hide w-full">
      <div className="grid grid-col-1 md:grid-cols-3 scrollbar-hide w-full">
        <Chatview />
        <div className="col-span-2">
          <Codeview />
        </div>
      </div>
    </div>
  );
};

export default Page;

