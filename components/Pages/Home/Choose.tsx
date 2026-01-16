import React from "react";
import {
  RiRobotLine,
  RiDiceLine,
  RiMapPinLine,
  RiLeafLine,
  RiMap2Line,
  RiBookLine,
  RiCheckboxLine,
  RiNotification3Line,
  RiShieldCheckLine,
  RiShakeHandsLine
} from "react-icons/ri";

// Feature content data with icons
const featureData = [
  {
    icon: RiRobotLine,
    title: "AI Planner",
    description: "Your personal intelligent travel architect.",
    bullets: [
      "Smart itineraries",
      "Feasibility checks",
      "Budget balancing",
      "Time optimization"
    ]
  },
  {
    icon: RiDiceLine,
    title: "Mystery Trip",
    description: "Let fate decide your next great adventure.",
    bullets: [
      "Surprise destinations",
      "Curated reveals",
      "Budget-aligned",
      "Thrill factor"
    ]
  },
  {
    icon: RiMapPinLine,
    title: "Nearby",
    description: "Discover the magic hidden right around you.",
    bullets: [
      "Instant discovery",
      "Local hotspots",
      "Walking tours",
      "Hidden gems"
    ]
  },
  {
    icon: RiLeafLine,
    title: "Eco Tours",
    description: "Travel responsibly with sustainable footprints.",
    bullets: [
      "Green stays",
      "Carbon tracking",
      "Nature-first",
      "Ethical guides"
    ]
  },
  {
    icon: RiMap2Line,
    title: "Khazana Map",
    description: "Unlock the treasure chest of local secrets.",
    bullets: [
      "Interactive view",
      "Cultural icons",
      "Offline mode",
      "Rich details"
    ]
  },
  {
    icon: RiBookLine,
    title: "Travel Journal",
    description: "Document every moment of your journey.",
    bullets: [
      "Photo memories",
      "Daily logs",
      "Smart tagging",
      "Shareable content"
    ]
  },
  {
    icon: RiCheckboxLine,
    title: "AI Checklist",
    description: "Smart packing tailored to your destination.",
    bullets: [
      "Weather-adaptive",
      "Activity-based",
      "Essential alerts",
      "Customizable"
    ]
  },
  {
    icon: RiNotification3Line,
    title: "Real-Time Alerts",
    description: "Stay ahead of delays and disruptions.",
    bullets: [
      "Instant updates",
      "Flight tracking",
      "Weather warnings",
      "Safety pings"
    ]
  },
  {
    icon: RiShieldCheckLine,
    title: "Safety Score",
    description: "Real-time safety insights for peace of mind.",
    bullets: [
      "Area ratings",
      "Health tips",
      "Emergency info",
      "Live updates"
    ]
  },
  {
    icon: RiShakeHandsLine,
    title: "Local Connect",
    description: "Bridge the gap with authentic local culture.",
    bullets: [
      "Meet guides",
      "Language aid",
      "Cultural exchange",
      "Community events"
    ]
  }
];

interface Feature {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
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

                  {/* Background Icon */}
                  <feature.icon className="absolute -bottom-8 -right-8 text-[200px] text-[#4da528] opacity-10 pointer-events-none group-hover:scale-105 group-hover:opacity-15 transition-all duration-500" />

                  {/* Title */}
                  <h3 className={`font-bold Mont leading-[1.2] text-gray-900 relative z-10 ${isBig ? 'text-[26px]' : 'text-[20px]'
                    }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-gray-600 leading-[1.5] font-light mt-[6px] Inter relative z-10 ${isBig ? 'text-[15px]' : 'text-[13px]'
                    }`}>
                    {feature.description}
                  </p>

                  {/* Feature Bullets - 2 columns with proper alignment */}
                  <div className={`grid grid-cols-2 gap-x-[10px] gap-y-[6px] mt-[10px] relative z-10 ${isBig ? 'text-[13px]' : 'text-[11px]'
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
                  <div className="mt-auto pt-[12px] flex items-center justify-between border-t border-gray-100 relative z-10">
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
            className="bg-white rounded-[12px] p-[24px] border border-gray-100 shadow-md relative overflow-hidden group"
          >
            {/* Background Icon */}
            <feature.icon className="absolute -bottom-6 -right-6 text-[140px] text-[#4da528] opacity-10 pointer-events-none" />

            <h3 className="text-[18px] font-bold Mont mb-[6px] leading-[1.2] relative z-10">
              {feature.title}
            </h3>

            <p className="text-[13px] text-gray-600 mb-[10px] font-light leading-[1.5] Inter relative z-10">
              {feature.description}
            </p>

            <div className="flex flex-col gap-[6px] mb-[12px] relative z-10">
              {feature.bullets.slice(0, 3).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-center gap-[5px]">
                  <span className="text-[12px] text-[#4da528] font-bold flex-shrink-0 leading-none">•</span>
                  <span className="text-[12px] text-gray-700 font-light Inter">{bullet}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-[10px] border-t border-gray-100 relative z-10">
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