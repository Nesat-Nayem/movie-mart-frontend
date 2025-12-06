"use client";
import React, { useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import SearchModal from "@/app/components/SearchModal";
import LocationModal from "@/app/components/LocationModal";
import ProfileDrawer from "@/app/components/ProfileDrawer";
import { FaShoppingBasket, FaCalendarAlt, FaFilm, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: FaShoppingBasket, label: "Film Mart", href: "/film-mart" },
    { icon: FaCalendarAlt, label: "Events", href: "/events" },
    { icon: FaFilm, label: "Watch Movies", href: "/watch-movies" },
  ];

  return (
    <header className="w-full shadow-md border-b border-dotted border-gray-500 text-white bg-[#0f172a] sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Left Section - Logo + Search Box (Desktop) */}
          <div className="flex items-center space-x-3">
            <Logo />
            {/* Always-visible search on desktop */}
            <SearchModal className="hidden md:block w-64" />
          </div>

          {/* Middle Section - Nav Items (Desktop) - Absolutely centered */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm font-medium hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200"
              >
                <item.icon className="text-sm" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section - Location & Profile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Location - hidden on mobile */}
            <div className="hidden sm:block">
              <LocationModal />
            </div>
            
            {/* Profile */}
            <ProfileDrawer />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition cursor-pointer"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          {/* Mobile Search */}
          <div className="pb-3 sm:hidden">
            <SearchModal />
          </div>

          {/* Mobile Nav Items */}
          <nav className="flex flex-col space-y-1 pb-3">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200"
              >
                <item.icon className="text-base" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Location */}
          <div className="sm:hidden pb-3 px-2">
            <LocationModal />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
