import React from "react";

// Feature content data with exact structure from BMAD spec
const featureData = [
  {
    title: "AI Trip Planner",
    description: "End-to-end trip simulation based on time, budget, and intent.",
    bullets: [
      "Multi-city itinerary generation",
      "Flexible date optimization",
      "Activity pacing intelligence",
      "Feasibility scoring"
    ]
  },
  {
    title: "Smart Budget Optimizer",
    description: "Stress-tests travel plans against real costs.",
    bullets: [
      "Budget breakpoints detection",
      "Daily spend forecasting",
      "Overrun risk alerts",
      "Cost rebalancing suggestions"
    ]
  },
  {
    title: "Hotel Personalization Engine",
    description: "Accommodation ranked to your travel style.",
    bullets: [
      "Comfort vs price scoring",
      "Location sensitivity modeling",
      "Review sentiment filtering",
      "Sleep quality predictors"
    ]
  },
  {
    title: "Auto Compare Flights & Hotels",
    description: "Data-driven comparisons without bias.",
    bullets: [
      "Price history overlays",
      "Hidden fee detection",
      "Time vs cost tradeoffs",
      "Best-value ranking"
    ]
  },
  {
    title: "Weather + Crowd Predictor",
    description: "Predicts stress before it happens.",
    bullets: [
      "Weather pattern simulations",
      "Crowd density forecasts",
      "Peak pressure alerts",
      "Alternate timing suggestions"
    ]
  },
  {
    title: "Smart Packing List Generator",
    description: "Context-aware packing intelligence.",
    bullets: [
      "Weather-based packing logic",
      "Airline rule validation",
      "Trip-specific essentials",
      "Forget-risk warnings"
    ]
  },
  {
    title: "Visa & Document Checker",
    description: "Travel compliance before booking.",
    bullets: [
      "Visa requirement detection",
      "Document completeness checks",
      "Processing time estimates",
      "Rejection risk scoring"
    ]
  },
  {
    title: "Hidden Gems Recommender",
    description: "Places beyond crowded highlights.",
    bullets: [
      "Overcrowding filters",
      "Local relevance scoring",
      "Distance-effort balancing",
      "Cultural depth indicators"
    ]
  },
  {
    title: "Group Trip Preference Matcher",
    description: "Prevents group travel conflicts.",
    bullets: [
      "Preference overlap mapping",
      "Budget tolerance matching",
      "Schedule conflict alerts",
      "Fairness optimization"
    ]
  },
  {
    title: "Personality-Based Activity Finder",
    description: "Experiences aligned with personal traits.",
    bullets: [
      "Energy level calibration",
      "Social vs solo balance",
      "Risk appetite matching",
      "Interest clustering"
    ]
  }
];

interface Feature {
  title: string;
  description: string;
  bullets: string[];
}

const Choose = () => {
  // Create alternating rows with proper typing
  const rows: Feature[][] = [];
  featureData.forEach((feature, index) => {
    if (index % 2 === 0) {
      rows.push([feature]);
    } else {
      rows[rows.length - 1].push(feature);
    }
  });

  return (
    <div className="mx-auto max-w-[1400px] px-[80px] py-[80px] ">
      {/* Header Section - Premium */}
      <div className="text-center mb-[72px] max-w-4xl mx-auto" data-aos="fade-up">
        <p className="Mont text-[18px] tracking-[4px] uppercase text-[#4da528] font-bold  mb-[12px]">
          WHY CHOOSE US
        </p>
        <h2 className=" text-[56px] lg:text-[68px] Mont leading-[1.1] mb-[20px] bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          Features We Offer
        </h2>
        <p className="Mont text-[22px] text-gray-600 leading-[1.6] max-w-5xl mx-auto Inter">
          Every trip tells a story, and we help you write yours beautifully.
          From smart planning to real-time guidance, we combine intelligence with human care.
        </p>
      </div>

      {/* Cards Grid - Alternating big/small layout with reduced height */}
      <div className="flex flex-col gap-[24px] max-w-6xl mx-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[24px] items-stretch" data-aos="fade-up" data-aos-delay={rowIndex * 100}>
            {row.map((feature, featureIndex) => {
              const absoluteIndex = rowIndex * 2 + featureIndex;
              const isBig = (rowIndex % 2 === 0 && featureIndex === 0) || (rowIndex % 2 === 1 && featureIndex === 1);

              return (
                <div
                  key={absoluteIndex}
                  className={`bg-white rounded-[12px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-[3px] transition-all duration-300 flex flex-col group relative overflow-hidden ${isBig
                    ? 'flex-[1.6] p-[32px] min-h-[320px]'
                    : 'flex-[1] p-[24px] min-h-[260px]'
                    }`}
                >
                  {/* Premium Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4da528] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Title */}
                  <h3 className={`font-bold Mont leading-[1.2] text-gray-900 ${isBig ? 'text-[26px]' : 'text-[20px]'
                    }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-gray-600 leading-[1.5] font-light mt-[6px] Inter ${isBig ? 'text-[15px]' : 'text-[13px]'
                    }`}>
                    {feature.description}
                  </p>

                  {/* Feature Bullets - 2 columns with proper alignment */}
                  <div className={`grid grid-cols-2 gap-x-[10px] gap-y-[6px] mt-[10px] ${isBig ? 'text-[13px]' : 'text-[11px]'
                    }`}>
                    {feature.bullets.slice(0, 4).map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-center gap-[5px]">
                        <span className={`text-[#4da528] font-bold flex-shrink-0 leading-none ${isBig ? 'text-[14px]' : 'text-[12px]'
                          }`}>•</span>
                        <span className="text-gray-700 leading-[1.4] font-light Inter">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Row - Compact */}
                  <div className="mt-auto pt-[12px] flex items-center justify-between border-t border-gray-100">
                    <button className={`bg-black text-white font-bold Mont rounded-full hover:bg-[#4da528] hover:shadow-lg hover:shadow-[#4da528]/30 transition-all duration-300 transform group-hover:scale-[1.02] ${isBig ? 'text-[12px] px-[16px] py-[6px]' : 'text-[10px] px-[12px] py-[5px]'
                      }`}>
                      SEE MORE
                    </button>
                    {/* Progress Line - Compact */}
                    <div className="flex items-center gap-[4px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`h-[2px] bg-[#4da528] rounded-full transform group-hover:w-[28px] transition-all duration-300 ${isBig ? 'w-[24px]' : 'w-[18px]'
                        }`}></div>
                      <div className={`h-[2px] bg-gray-300 rounded-full ${isBig ? 'w-[8px]' : 'w-[6px]'
                        }`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-[20px] max-w-3xl mx-auto mt-[48px]">
        {featureData.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-[12px] p-[24px] border border-gray-100 shadow-md"
          >
            <h3 className="text-[18px] font-bold Mont mb-[6px] leading-[1.2]">
              {feature.title}
            </h3>

            <p className="text-[13px] text-gray-600 mb-[10px] font-light leading-[1.5] Inter">
              {feature.description}
            </p>

            <div className="flex flex-col gap-[6px] mb-[12px]">
              {feature.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-center gap-[5px]">
                  <span className="text-[12px] text-[#4da528] font-bold flex-shrink-0 leading-none">•</span>
                  <span className="text-[12px] text-gray-700 font-light Inter">{bullet}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-[10px] border-t border-gray-100">
              <button className="bg-black text-white text-[11px] font-bold Mont px-[12px] py-[5px] rounded-full hover:bg-[#4da528] transition-colors duration-200">
                SEE MORE
              </button>
              <div className="flex items-center gap-[4px] opacity-60">
                <div className="w-[20px] h-[2px] bg-[#4da528] rounded-full"></div>
                <div className="w-[6px] h-[2px] bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Choose;