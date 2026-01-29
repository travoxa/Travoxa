"use client";

import { useState } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { route } from "@/lib/route";
import { signOut, useSession } from "next-auth/react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseAuth";
import LoginRequiredPopup from "./LoginRequiredPopup";

export default function NormalHeader({ backgroundColor = "bg-white" }: { backgroundColor?: string }) {

    const { data: session } = useSession()

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    type DropdownItem = {
        label: string;
        path: string;
    };

    type MenuItem = {
        label: string;
        path?: string;
        dropdown: DropdownItem[];
        className?: string;
    };

    const toggleDropdown = (menu: string) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const menuItems: MenuItem[] = [
        {
            label: "Tour",
            path: "/tour",
            dropdown: [],
        },
        {
            label: "Travoxa Ai",
            path: "/ai-trip-planner",
            dropdown: [
                { label: "Ai Trip", path: "/ai-trip-planner" },
                { label: "Mystery Trip", path: "/ai-trip-planner" },
                { label: "Nearby Explorer", path: "/ai-trip-planner" },
                { label: "Local Connect", path: "/ai-trip-planner" },
                { label: "Khazana Map", path: "/ai-trip-planner" },
            ],
        },
        {
            label: "Discovery",
            path: "/travoxa-discovery",
            dropdown: [
                { label: "Sightseeing", path: "/travoxa-discovery/sightseeing" },
                { label: "Rentals", path: "/travoxa-discovery/rentals" },
                { label: "Local Connect", path: "/travoxa-discovery/local-connect" },
                { label: "Activities", path: "/travoxa-discovery/activities" },
                { label: "Attractions", path: "/travoxa-discovery/attractions" },
                { label: "Food & Cafes", path: "/travoxa-discovery/food-and-cafes" },
                { label: "Emergency Help", path: "/travoxa-discovery/emergency-help" },
                { label: "Volunteer Yatra", path: "/travoxa-discovery/volunteer-yatra" },
                { label: "Creator Collab", path: "/travoxa-discovery/creator-collab" },
            ]
        },
        {
            label: "Backpackers",
            path: "/backpackers",
            dropdown: [
                { label: "Create Group", path: "" },
                { label: "Join Group", path: "/backpackers" },
            ],
        },

        {
            label: "Explore",
            path: "#",
            dropdown: [
                { label: "About Us", path: "/about" },
                { label: "Team Member", path: "/team" },
                { label: "Gallery", path: "/gallery" },
                { label: "Terms & Conditions", path: "/terms" },
                { label: "Help Center", path: "/help" },
            ],
        },
        {
            label: "Nestloop",
            path: "/contact",
            dropdown: [],
        },
    ];

    const navigateTo = (path?: string) => {
        if (!path) return;
        route(path);
        setMobileOpen(false);
    };

    const handleCreateGroupClick = () => {
        if (!session?.user?.email) {
            setShowLoginPopup(true);
            return;
        }
        route('/backpackers/create');
    };

    const routeTo = (path: string) => {
        route(path)
    }

    // Handle sign out for both NextAuth and Firebase Auth
    const handleSignOut = async () => {
        try {
            const firebaseAuth = getFirebaseAuth();
            if (!firebaseAuth) {
                console.warn("Firebase Auth not initialized; skipping Firebase sign-out.");
            } else {
                // Sign out from Firebase Auth (for email/password users)
                await firebaseSignOut(firebaseAuth);
            }

            // Sign out from NextAuth (handles both Google and email/password sessions)
            await signOut({ callbackUrl: '/login' });
        } catch (error) {
            console.error("Error signing out:", error);
            // Even if Firebase sign out fails, still sign out from NextAuth
            await signOut({ callbackUrl: '/login' });
        }
    };


    return (
        <>
            {/* MAIN NAVBAR - Normal Bar Style */}
            <header className={`w-full ${backgroundColor} shadow-md fixed top-0 left-0 right-0 z-50 Mont border-b border-gray-200`}>
                <LoginRequiredPopup
                    isOpen={showLoginPopup}
                    onClose={() => setShowLoginPopup(false)}
                    triggerAction={() => route('/login')}
                />
                <div className="z-50 w-full max-w-[1400px] mx-auto relative flex items-center justify-between px-8 py-3 transition-all duration-300">


                    {/* LOGO */}
                    <button
                        onClick={() => routeTo('/')}
                        className="flex items-center h-fit">
                        <Image
                            src="/logo.png"
                            alt="Travoxa"
                            width={130}
                            height={1000}
                            className="h-[40px] lg:h-[50px]"
                            style={{ width: "auto" }}
                        />
                    </button>

                    {/* DESKTOP MENU */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {menuItems.map((item) => (
                            <div key={item.label} className="relative group">
                                <button
                                    type="button"
                                    onClick={() => navigateTo(item.path)}
                                    className={`flex items-center gap-1 text-[13px] font-medium cursor-pointer focus:outline-none transition-colors ${item.className ? item.className : 'text-gray-900 group-hover:text-green-600'}`}
                                >
                                    {item.label}
                                    {item.dropdown.length > 0 && <FiChevronDown size={14} />}
                                </button>

                                {/* DROPDOWN DESKTOP */}
                                {item.dropdown.length > 0 && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                                        {item.dropdown.map((sub) => (
                                            <button
                                                key={sub.label}
                                                type="button"
                                                onClick={() => {
                                                    if (sub.label === "Create Group") {
                                                        handleCreateGroupClick();
                                                    } else {
                                                        navigateTo(sub.path);
                                                    }
                                                }}
                                                className="block w-full text-left px-4 py-2 text-xs text-gray-800 hover:bg-green-50"
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* RIGHT SECTION (DESKTOP) */}
                    {!session?.user?.email ?
                        <button

                            onClick={() => routeTo('/login')}

                            className="hidden lg:flex items-center gap-6 text-[14px] bg-black text-white rounded-[30px] px-[24px] py-[12px] hover:bg-gray-800 transition-colors">
                            LOGIN
                        </button>
                        : <button

                            onClick={() => route('/dashboard')}

                            className="hidden lg:flex items-center gap-6 text-[14px] bg-black text-white rounded-[30px] px-[24px] py-[12px] hover:bg-gray-800 transition-colors">
                            DASHBOARD
                        </button>}

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
                className={`fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* MOBILE HEADER */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <Image
                        src="/logo.png"
                        alt="Travoxa"
                        width={110}
                        height={35}
                        style={{ width: "auto", height: "auto" }}
                    />
                    <button onClick={() => setMobileOpen(false)}>
                        <FiX size={26} className="text-gray-700" />
                    </button>
                </div>

                {/* MOBILE MENU */}
                <nav className="flex flex-col px-4 py-4 gap-2">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            {/* MAIN ITEM */}
                            <button
                                type="button"
                                className={`flex items-center justify-between w-full py-3 text-sm font-medium border-b ${item.className ? item.className : 'text-gray-900'}`}
                                onClick={() =>
                                    item.dropdown.length > 0
                                        ? toggleDropdown(item.label)
                                        : navigateTo(item.path)
                                }
                            >
                                <span>{item.label}</span>
                                {item.dropdown.length > 0 && (
                                    <FiChevronDown
                                        className={`${openDropdown === item.label ? "rotate-180" : ""} transition-transform`}
                                    />
                                )}
                            </button>

                            {/* MOBILE DROPDOWN */}
                            {openDropdown === item.label && item.dropdown.length > 0 && (
                                <div className="ml-3 flex flex-col gap-2 py-2">
                                    {item.dropdown.map((sub) => (
                                        <button
                                            key={sub.label}
                                            type="button"
                                            className="py-2 text-left text-xs text-gray-700 border-b"
                                            onClick={() => {
                                                if (sub.label === "Create Group") {
                                                    handleCreateGroupClick();
                                                    setMobileOpen(false);
                                                } else {
                                                    navigateTo(sub.path);
                                                }
                                            }}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}

                                </div>
                            )}
                        </div>
                    ))}

                    {!session?.user?.email ?
                        <button

                            onClick={() => routeTo('/login')}

                            className="flex items-center gap-6 text-white text-[14px] bg-black rounded-[30px] px-[24px] py-[12px]">
                            LOGIN
                        </button>
                        : <button

                            onClick={() => routeTo('/dashboard')}

                            className="flex items-center gap-6 text-white text-[14px] bg-black rounded-[30px] px-[24px] py-[12px]">
                            DASHBOARD
                        </button>
                    }
                </nav>
            </div>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Login Required Popup */}

        </>
    );
}
