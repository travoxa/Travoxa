import Image from 'next/image'
import React from 'react'
import { useState, useEffect } from 'react'
import { createPortal } from "react-dom";
import Link from 'next/link'
const AboutUsQuote = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [visible, setVisible] = useState(false); // for smooth transition
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
    setTimeout(() => setVisible(true), 10); // trigger transition
  };

  const closePopup = () => {
    setVisible(false); // start fade-out
    setTimeout(() => setShowPopup(false), 300); // remove from DOM after transition
  };

  const submitForm = () => {
    if (!email) return alert("Enter email");
    if (!consent) return alert("Please check the box")
    console.log("Email:", email, "Consent:", consent);
    setEmail("");
    setConsent(false)
    closePopup();
  };
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
          <div>

            {/* Button to open popup */}
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all font-medium" onClick={openPopup}>
              Remind me
            </button>


            {/* Popup */}
            {showPopup &&
              createPortal(
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.7)",
                    zIndex: 9999,
                    opacity: visible ? 1 : 0,
                    pointerEvents: visible ? "auto" : "none",
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      background: "#fff",
                      padding: "30px 40px",
                      borderRadius: "25px", // slightly more rounded modal edges
                      boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                      width: "600px",
                      maxWidth: "90%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "25px",
                      transform: visible ? "scale(1)" : "scale(0.8)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <button
                      onClick={closePopup}
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "20px",
                        background: "transparent",
                        border: "none",
                        fontSize: "25px",
                        cursor: "pointer",
                        fontWeight:"inherit",
                        lineHeight: "1",
                      }}
                    >
                      &times;
                    </button>
                    <h3 style={{
                      margin: 0,
                      textAlign: "center",
                      fontSize: "20px",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: "600",
                    }}>Enter Your Details</h3>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      style={{
                        width: "100%",
                        padding: "12px 23px",
                        fontSize: "14px",
                        lineHeight: "20px",
                        borderRadius: "50px",      // capsule
                        border: "1px solid #ccc",
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "Inter, sans-serif",
                        transition: "border 0.2s",
                      }}
                    />

                    {/* Consent textarea */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        style={{ width: "15px", height: "15px", cursor: "pointer", marginLeft: "7px" }}
                      />
                      <label style={{ fontSize: "10px", cursor: "pointer" }}>
                        I agree to the terms & Conditions and give my consent
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={submitForm}
                        style={{
                          width: "100%",             // full width like input
                          padding: "12px 23px",      // same padding as input
                          fontSize: "14px",
                          lineHeight: "20px",        // same height as input
                          borderRadius: "50px",      // capsule
                          border: "none",
                          backgroundColor: "#000000",
                          color: "#fff",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#070505")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}

          </div>


          <Link href='/about'>
            <button className="bg-white border border-gray-300 text-black px-8 py-3 rounded-full hover:bg-gray-50 transition-all font-medium">
              Learn More
            </button>
          </Link>
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