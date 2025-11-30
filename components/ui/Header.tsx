"use client";

import { useState } from "react";
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menuItems = [
    {
      label: "Home",
      dropdown: [],
    },
    {
      label: "Tour",
      dropdown: ["Solo Tours", "Couple Tours", "Family Tours", "Friends Group Tours"], // No items given
    },
    {
      label: "Travoxa Ai",
      dropdown: ["Ai Trip", "Mystery Trip", "Nearby Explorer", "Local Connect"],
    },
    {
      label: "Backpackers",
      dropdown: ["Create Group", "Join Group"],
    },
    {
      label: "Pages",
      dropdown: ["About Us", "Team Member", "Gallery", "Terms & Conditions", "Help Center"],
    },
    {
      label: "Dashboard",
      dropdown: ["Dashboard", "My Booking", "My Listing", "Add Tour", "My Favorites", "My Profile"],
    },
    {
      label: "Nestloop",
      dropdown: [], // nothing
    },
  ];

  return (
    <>
      {/* MAIN NAVBAR */}
      <header className="w-screen  bg-transparent  relative z-50 ">
        <div className="mt-[24px] custom-shadow backdrop-blur-sm border-[0.5] border-white  w-[80vw] rounded-[40px] mx-auto relative flex items-center justify-between px-4 pr-5 py-3">
          

          {/* LOGO */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Travoxa"
              width={130}
              height={40}
            />
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <div className="flex items-center gap-1 text-[15px] font-medium text-gray-900 cursor-pointer group-hover:text-green-600">
                  {item.label}
                  {item.dropdown.length > 0 && <FiChevronDown size={16} />}
                </div>

                {/* DROPDOWN DESKTOP */}
                {item.dropdown.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                    {item.dropdown.map((sub, subIndex) => (
                      <div
                        key={subIndex}
                        className="px-4 py-2 text-sm text-gray-800 hover:bg-green-50 cursor-pointer"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT SECTION (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-6 text-black text-[14px] bg-white rounded-[30px] px-[24px] py-[12px]">
            LOGIN
            
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden text-gray-800"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={28} />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Image
            src="/logo.png"
            alt="Travoxa"
            width={110}
            height={35}
          />
          <button onClick={() => setMobileOpen(false)}>
            <FiX size={26} className="text-gray-700" />
          </button>
        </div>

        {/* MOBILE MENU */}
        <nav className="flex flex-col px-4 py-4 gap-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {/* MAIN ITEM */}
              <div
                className="flex items-center justify-between py-3 text-lg font-medium border-b text-gray-900 cursor-pointer"
                onClick={() => toggleDropdown(item.label)}
              >
                {item.label}
                {item.dropdown.length > 0 && <FiChevronDown className={`${openDropdown === item.label ? "rotate-180" : ""} transition-transform`} />}
              </div>

              {/* MOBILE DROPDOWN */}
              {openDropdown === item.label && item.dropdown.length > 0 && (
                <div className="ml-3 flex flex-col gap-2 py-2">
                  {item.dropdown.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      className="py-2 text-gray-700 border-b cursor-pointer"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
