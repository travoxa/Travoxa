import FlipCardSimple from "@/components/ui/components/desinger/FlipCard";
import React from "react";
import { AiFillOpenAI } from "react-icons/ai";

const features = [
  "AI Trip Planner",
  "Smart Budget Optimizer",
  "Hotel Personalization Engine",
  "Auto Compare Flights & Hotels",
  "Weather + Crowd Predictor",
  "Smart Packing List Generator",
  "Visa & Document Checker",
  "Hidden Gems Recommender",
  "Group Trip Preference Matcher",
  "Personality-Based Activity Finder",
];

const Choose = () => {
  return (
    <div className="mx-[12px] mt-[24px] bg-white py-[48px] px-[48px] rounded-[12px] ">
      <div className="text-center lg:text-left block  justify-between lg:justify-center items-center lg:items-start gap-[24px]">
        
        {/* Left Section */}
        <div className="lg:mr-[48px] text-center">
          <p className="text-[24px] text-slate-500 font-light text-center Mont">WHY CHOOSE US</p>
          <p className="text-[36px] mt-[12px] Mont">Features We Offer</p>
          <p className="text-[20px] text-[#4da528] font-light Mont" >Every trip tells a story, and we help you write yours beautifully.
            <span className="lg:block hidden" >From smart planning to real-time guidance, we combine intelligence with human care.
            You travel with confidence—always.</span></p>
          {/* <button className=" bg-white text-black font-light Mont px-10 py-3 rounded-full mt-[24px] shadow-lg uppercase hover:shadow-[#4da528] transition-shadow">Start Planning with AI </button> */}

        </div>

        {/* Right Section - Block Wall Layout */}
       <div className="hidden lg:flex justify-center items-center w-full" >
         <div className="w-fit hidden mt-[48px]  lg:grid grid-cols-2 lg:grid-cols-5 justify-between items-center gap-4">
            {features.map((item, i) => (
             
              <div key={i} >
                <FlipCardSimple item={item} />
              </div>
            ))}
          </div>
       </div>
        <div className="mt-[48px] flex lg:hidden flex-col gap-4">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 text-sm sm:text-base"
            >
              <AiFillOpenAI className="text-[20px] sm:text-[24px]" />
              <p>{item}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Choose;
