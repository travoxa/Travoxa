// app/components/Hero.tsx
"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-screen h-[87vh] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(/hero-bg.jpg)` }} >
        <p className="text-center pt-[5vh] text-[200px] font-[700] text-white Mont tracking-wider text-shadow-blue-400" >TRAVOXA</p>
        <div className="flex flex-col justify-center items-center text-white" >
          {/* <p className="text-center text-[20px] w-[50vw] text-[#05081b] " style={{ textShadow: "0 0 5px rgba(0, 0, 0, 0.5)" }} >Plan smarter with Travoxa AI, find groups with Backpackers Club, aur discover budget-friendly destinations – sab ek hi platform par. </p> */}
          <button className="bg-[#3b85e4] text-white Mont px-10 py-3 rounded-md mt-4 shadow-lg uppercase">Start Planning with AI</button>
        </div>
        
    </div>
  );
}
