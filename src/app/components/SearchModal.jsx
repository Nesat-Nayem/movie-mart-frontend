"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const SearchModal = ({ className = "", iconOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("Movies");
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  const tabData = {
    Movies: ["Demon Slayer", "Heer Express", "Jolly LLB 3", "The Conjuring"],
    Stream: ["Money Heist", "Breaking Bad", "Stranger Things", "Loki"],
    Events: ["Sunburn Goa", "Tech Conference 2025", "Comedy Night"],
    Plays: ["Hamlet", "Macbeth", "The Lion King"],
    Sports: ["IPL 2025", "FIFA World Cup", "Wimbledon"],
    Activities: ["Go Karting", "Escape Room", "Cooking Workshop"],
  };

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleIconClick = () => {
    if (iconOnly) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setTimeout(() => searchBarRef.current?.focus(), 100);
      }
    } else {
      openModal();
    }
  };

  // Close expanded search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isExpanded && searchBarRef.current && !searchBarRef.current.closest('.search-container')?.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  return (
    <>
      {/* Search Trigger - Icon only or full bar */}
      <div className={`search-container ${className}`}>
        {iconOnly ? (
          <div className="flex items-center">
            <button
              onClick={handleIconClick}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-all duration-300 cursor-pointer"
            >
              <FaSearch className="text-lg" />
            </button>
            {/* Expandable search input */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? "w-48 md:w-64 opacity-100 ml-2" : "w-0 opacity-0"
              }`}
            >
              <input
                ref={searchBarRef}
                type="text"
                placeholder="Search..."
                onClick={openModal}
                className="w-full px-3 py-1.5 rounded-full border border-gray-500 bg-transparent text-white text-sm focus:border-gray-500 focus:outline-none cursor-pointer"
                readOnly
              />
            </div>
          </div>
        ) : (
          <div
            onClick={openModal}
            className="flex-1 max-w-md mx-4 cursor-pointer"
          >
            <div className="relative w-full">
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies, events..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-500 bg-transparent text-white text-sm cursor-pointer focus:outline-none"
                readOnly
              />
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#13162f] z-50 flex flex-col animate-fadeIn">
          {/* Top Section */}
          <div className="w-full shadow-md px-3 py-3 flex items-center justify-between">
            <div className="relative flex-1 max-w-full sm:max-w-2xl mx-auto">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for Movies, Events, Plays & more"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 sm:ml-3 text-2xl text-gray-300 hover:text-white cursor-pointer bg-red-500 rounded-full p-1"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Tabs */}
          <div className="w-full max-w-full sm:max-w-2xl mx-auto">
            <div className="px-2 sm:px-4 py-3 flex space-x-2 overflow-x-auto mt-3 mb-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {Object.keys(tabData).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item)}
                  className={`flex-shrink-0 w-24 h-10 flex items-center justify-center rounded-full border text-xs sm:text-sm transition cursor-pointer ${
                    activeTab === item
                      ? "bg-red-500 text-white border-red-500"
                      : "border-red-400 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="px-2 sm:px-4 mt-3">
              <h2 className="text-xs font-bold text-gray-300 mb-4">
                {activeTab} Suggestions
              </h2>
              <div className="bg-[#0f172a] rounded-lg shadow divide-y divide-gray-700">
                {tabData[activeTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 h-16 hover:bg-gray-700 cursor-pointer"
                  >
                    <Link
                      href="/movie-details"
                      className="text-sm text-white truncate"
                    >
                      {item}
                    </Link>
                    <span className="text-gray-400">🎬</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
