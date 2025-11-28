"use client";
import React, { useState } from "react";
import Logo from "@/app/components/Logo";
import SearchModal from "@/app/components/SearchModal";
import LocationModal from "@/app/components/LocationModal";
import ProfileDrawer from "@/app/components/ProfileDrawer";

const Navbar = () => {
  return (
    <header className="w-full shadow-md border-b border-dotted border-gray-500 text-white bg-[#0f172a]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left Section - Logo */}
        <Logo />

        {/* Middle Section - Search (desktop only) */}
        <SearchModal className="hidden sm:flex" />

        {/* Right Section - Location & Profile */}
        <div className="flex items-center space-x-5">
          <LocationModal />
          <ProfileDrawer />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 sm:hidden">
        <SearchModal />
      </div>
    </header>
  );
};

export default Navbar;
