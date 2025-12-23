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
    { icon: FaShoppingBasket, label: "Film Trade", href: "/film-mart" },
    { icon: FaCalendarAlt, label: "Events", href: "/events" },
    { icon: FaFilm, label: "Watch Movies", href: "/watch-movies" },
  ];

  return (
    <header className="w-full shadow-md border-b border-dotted border-gray-500 text-white bg-[#0f172a] sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop & Large Tablet Layout (lg and up) */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4">
          {/* Left Section - Logo + Search */}
          <div className="flex items-center space-x-3">
            <Logo />
            <SearchModal className="w-64" />
          </div>

          {/* Center Section - Nav Items */}
          <nav className="flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200 whitespace-nowrap"
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section - Location & Profile */}
          <div className="flex items-center justify-end space-x-4">
            <LocationModal />
            <ProfileDrawer />
          </div>
        </div>

        {/* Tablet Layout (md to lg) */}
        <div className="hidden md:flex lg:hidden items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Logo />
          </div>

          {/* Center - Compact Nav (Icons Only on smaller tablets) */}
          <nav className="flex items-center space-x-1 mx-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-full text-xs font-medium hover:text-red-400 hover:bg-gray-700/50 transition-all duration-200 whitespace-nowrap"
                title={item.label}
              >
                <item.icon className="text-lg" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right - Search, Location & Profile */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <SearchModal className="w-48" />
            <LocationModal />
            <ProfileDrawer />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Right Section - Profile & Menu Toggle */}
          <div className="flex items-center space-x-2">
            <ProfileDrawer />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          {/* Mobile Search */}
          <div className="pb-3">
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
          <div className="pb-3 px-2">
            <LocationModal />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
