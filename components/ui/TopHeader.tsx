"use client";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdCalendarToday } from "react-icons/md";

export default function TopHeader() {
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setDateString(formatted);
  }, []);

  return (
    <div className="w-full bg-[#f2f2f2] border-b border-gray-300 text-sm text-gray-900">
      <div
        className="
          mx-auto 
          flex flex-col md:flex-row
          justify-between items-center 
          px-4 py-2 
          gap-2 md:gap-0
        "
      >
        {/* LEFT SECTION */}
        <div
          className="
            flex flex-wrap 
            items-center justify-center md:justify-start 
            gap-4 md:gap-6
          "
        >
          {/* Date */}
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-green-600 text-lg" />
            <span>{dateString}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <MdEmail className="text-green-600 text-lg" />
            <span className="break-all">travoxa@gmail.com</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <MdPhone className="text-green-600 text-lg" />
            <span>+91 74397 08923</span>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="
            flex flex-wrap 
            items-center justify-center md:justify-end 
            gap-4 md:gap-6
          "
        >
          {/* Booking Now */}
          <a
            href="#"
            className="flex items-center gap-2 text-black hover:underline"
          >
            <MdCalendarToday className="text-green-600 text-lg" />
            <span>Booking Now</span>
          </a>

          {/* Follow Us */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span>Follow Us :</span>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="text-black hover:text-green-600">
                <FaFacebookF />
              </a>
              <a href="#" className="text-black hover:text-green-600">
                <FaInstagram />
              </a>
              <a href="#" className="text-black hover:text-green-600">
                <FaXTwitter />
              </a>
              <a href="#" className="text-black hover:text-green-600">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
