import React from "react";
import { AiFillOpenAI } from "react-icons/ai";

const features = [
  "AI Trip Planner",
  "Smart Budget Optimizer",
  "Hotel Personalization Engine",
  "Real-Time Travel Assistant",
  "Auto Compare Flights & Hotels",
  "Weather + Crowd Predictor",
  "Instant Local Language Translation",
  "Smart Packing List Generator",
  "Visa & Document Checker",
  "AI Travel Photo Enhancer",
  "Trip Safety Score",
  "Hidden Gems Recommender",
  "Group Trip Preference Matcher",
  "AI Cab Sharing Matcher",
  "Voice-Based Travel Guide",
  "AI Expense Tracker",
  "Beautiful PDF Itinerary Generator",
  "Smart Emergency Assistant",
  "Personality-Based Activity Finder",
  "Multi-Destination Route Optimizer",
];

const Choose = () => {
  return (
    <div className="mx-[48px] mt-[48px]">
      <div className="text-center lg:text-left block lg:flex justify-between lg:justify-between items-center lg:items-start gap-[24px]">
        
        {/* Left Section */}
        <div className="lg:mr-[48px]">
          <p className="text-[24px] text-slate-500 font-light">WHY CHOOSE US</p>
          <p className="text-[36px] mt-[12px]">Features We Offer</p>
          <p className="text-[20px] text-[#4da528] font-light" >Every trip tells a story, and we help you write yours beautifully.
            <span className="lg:block hidden" >From smart planning to real-time guidance, we combine intelligence with human care.
            You travel with confidence—always.</span></p>
          <button className=" bg-white text-black font-light Mont px-10 py-3 rounded-full mt-[24px] shadow-lg uppercase hover:shadow-[#4da528] transition-shadow">Start Planning with AI </button>

        </div>

        {/* Right Section - Block Wall Layout */}
        <div className="hidden  lg:flex flex-1 gap-[24px] mt-[36px] lg:mt-0">

          {/* Column 1 */}
          <div className="flex flex-1 flex-col gap-[24px]">
            {features.slice(0, 7).map((item, i) => (
              <div
                key={i}
                className="px-[48px] py-[24px] border-[0.5px] rounded-[24px] flex flex-1 items-center gap-[12px] hover:border-[#4da528] hover:border hover:shadow bg-white"
              >
                <AiFillOpenAI className="text-[24px]" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-1 flex-col gap-[24px]">
            {features.slice(7, 13).map((item, i) => (
              <div
                key={i}
                className="px-[48px] py-[24px] border-[0.5px] rounded-[24px] flex flex-1 items-center gap-[12px] hover:border-[#4da528] hover:border hover:shadow bg-white"
              >
                <AiFillOpenAI className="text-[24px]" />
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-1 flex-col gap-[24px]">
            {features.slice(13, 20).map((item, i) => (
              <div
                key={i}
                className="px-[48px] py-[24px] border-[0.5px] rounded-[24px] flex flex-1 items-center gap-[12px] hover:border-[#4da528] hover:border hover:shadow bg-white"
              >
                <AiFillOpenAI className="text-[24px]" />
                <p>{item}</p>
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
