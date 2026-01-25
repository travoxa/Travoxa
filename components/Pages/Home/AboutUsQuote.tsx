import Image from 'next/image'
import React from 'react'

const AboutUsQuote = () => {
  return (
    <div className='container mx-auto px-6 lg:px-20 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16' >

      {/* Text Content */}
      <div className="lg:w-1/2" data-aos="fade-right">
        <h2 className=" text-4xl lg:text-6xl text-black leading-tight mb-8 Mont">
          The Journey Of <br />
          <span className="text-gray-900">Travoxa AI</span>
        </h2>
        <p className='text-base lg:text-lg font-light text-gray-600 mb-8 leading-relaxed Inter'>
          <span className='font-normal text-black' >Welcome to Travoxa,</span> your smart, <span className='text-green-600 font-medium' >AI-powered</span> partner for exploring India's breathtaking destinations and rich cultural heritage. Whether you're seeking peaceful retreats on serene beaches, spiritual journeys through historic temples, or thrilling adventures in mountains and forests, Travoxa AI helps you discover the perfect travel experiences.
        </p>

        {/* Buttons - Hidden on mobile */}
        <div className="hidden md:flex gap-4">
          <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all font-medium">
            Reminder me
          </button>
          <button className="bg-white border border-gray-300 text-black px-8 py-3 rounded-full hover:bg-gray-50 transition-all font-medium">
            Learn More
          </button>
        </div>
      </div>

      {/* Visual Content - Grid of cards/images */}
      <div className="lg:w-1/2 grid grid-cols-2 gap-4" data-aos="fade-left">
        <div className="relative group overflow-hidden rounded-2xl h-[150px] md:h-[200px] lg:h-[250px] bg-gray-200">
          <img
            src="/Destinations/Des1.jpeg"
            alt="Taj Mahal"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl h-[150px] md:h-[200px] lg:h-[250px] mt-8 bg-gray-200">
          <img
            src="/Destinations/Des3.jpg"
            alt="Munnar"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl h-[150px] md:h-[200px] lg:h-[250px] -mt-8 bg-gray-200">
          <img
            src="/Destinations/Des7.jpg"
            alt="Ladakh"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl h-[150px] md:h-[200px] lg:h-[250px] bg-gray-200">
          <img
            src="/Destinations/Des10.jpg"
            alt="Kashmir"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        </div>
      </div>

    </div>
  )
}

export default AboutUsQuote