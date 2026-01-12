"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaFilm, FaCalendarAlt, FaPlay } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useGetMoviesQuery } from "../../../store/moviesApi";
import { useGetEventsQuery } from "../../../store/eventsApi";
import { useGetWatchVideosQuery } from "../../../store/watchVideosApi";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchModal = ({ className = "", iconOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("FilmTrade");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // API queries with search parameter
  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesQuery(
    { search: debouncedSearch, limit: 10 },
    { skip: !isOpen || activeTab !== "FilmTrade" || !debouncedSearch }
  );

  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery(
    { search: debouncedSearch, limit: 10 },
    { skip: !isOpen || activeTab !== "Events" || !debouncedSearch }
  );

  const { data: watchVideosData, isLoading: watchVideosLoading } = useGetWatchVideosQuery(
    { search: debouncedSearch, limit: 10, status: "published" },
    { skip: !isOpen || activeTab !== "WatchVideos" || !debouncedSearch }
  );

  // Get results based on active tab
  const getResults = useCallback(() => {
    switch (activeTab) {
      case "FilmTrade":
        return {
          items: Array.isArray(moviesData) ? moviesData : [],
          loading: moviesLoading,
          icon: <FaFilm className="text-red-400" />,
          getLink: (item) => `/film-mart-details/${item._id}`,
          getTitle: (item) => item.title,
          getSubtitle: (item) => `${item.genres?.slice(0, 2).join(", ") || ""} • ${item.languages?.[0] || ""}`,
        };
      case "Events":
        return {
          items: Array.isArray(eventsData) ? eventsData : [],
          loading: eventsLoading,
          icon: <FaCalendarAlt className="text-pink-400" />,
          getLink: (item) => `/events/${item._id}`,
          getTitle: (item) => item.title,
          getSubtitle: (item) => `${item.location?.city || ""} • ${item.startDate ? new Date(item.startDate).toLocaleDateString() : ""}`,
        };
      case "WatchVideos":
        return {
          items: watchVideosData?.videos || [],
          loading: watchVideosLoading,
          icon: <FaPlay className="text-blue-400" />,
          getLink: (item) => `/watch-movie-deatils?id=${item._id}`,
          getTitle: (item) => item.title,
          getSubtitle: (item) => `${item.videoType === "series" ? "Series" : "Movie"} • ${item.languages?.[0] || ""}`,
        };
      default:
        return { items: [], loading: false, icon: null, getLink: () => "#", getTitle: () => "", getSubtitle: () => "" };
    }
  }, [activeTab, moviesData, eventsData, watchVideosData, moviesLoading, eventsLoading, watchVideosLoading]);

  const { items, loading, icon, getLink, getTitle, getSubtitle } = getResults();

  const tabs = [
    { key: "FilmTrade", label: "Film Trade", icon: "🎬" },
    { key: "WatchVideos", label: "Watch Videos", icon: "📺" },
    { key: "Events", label: "Events", icon: "🎉" },
  ];

  const openModal = () => {
    setIsOpen(true);
    setSearchQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearchQuery("");
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
      if (isExpanded && searchBarRef.current && !searchBarRef.current.closest(".search-container")?.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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
          <div onClick={openModal} className="flex-1 max-w-md mx-4 cursor-pointer">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Movies, Events, Videos & more"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-red-500 focus:outline-none text-sm"
                autoFocus
              />
            </div>
            <button
              onClick={closeModal}
              className="ml-2 sm:ml-3 text-2xl text-gray-300 hover:text-white cursor-pointer bg-red-500 rounded-full p-1"
            >
              <IoMdClose />
            </button>
          </div>

          {/* Tabs */}
          <div className="w-full max-w-full sm:max-w-2xl mx-auto">
            <div className="px-2 sm:px-4 py-3 flex space-x-2 overflow-x-auto mt-3 mb-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 px-4 h-10 flex items-center justify-center gap-2 rounded-full border text-xs sm:text-sm transition cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-red-500 text-white border-red-500"
                      : "border-red-400 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="px-2 sm:px-4 mt-3 overflow-y-auto max-h-[calc(100vh-200px)]">
              <h2 className="text-xs font-bold text-gray-300 mb-4">
                {debouncedSearch ? `Search Results for "${debouncedSearch}"` : `Popular ${tabs.find((t) => t.key === activeTab)?.label}`}
              </h2>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400 text-sm">Searching...</p>
                </div>
              )}

              {/* No Search Query */}
              {!debouncedSearch && !loading && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <FaSearch className="text-4xl mb-3 opacity-50" />
                  <p className="text-sm">Start typing to search</p>
                </div>
              )}

              {/* No Results */}
              {debouncedSearch && !loading && items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <p className="text-lg mb-2">😕</p>
                  <p className="text-sm">No results found for "{debouncedSearch}"</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              )}

              {/* Results List */}
              {!loading && items.length > 0 && (
                <div className="bg-[#0f172a] rounded-lg shadow divide-y divide-gray-700">
                  {items.map((item, idx) => (
                    <Link
                      key={item._id || idx}
                      href={getLink(item)}
                      onClick={closeModal}
                      className="flex items-center gap-3 px-3 py-4 hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      {/* Thumbnail */}
                      {(item.posterUrl || item.thumbnailUrl || item.posterImage) && (
                        <img
                          src={item.posterUrl || item.thumbnailUrl || item.posterImage}
                          alt={getTitle(item)}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{getTitle(item)}</p>
                        <p className="text-xs text-gray-400 truncate">{getSubtitle(item)}</p>
                      </div>
                      <span className="text-lg">{icon}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All Link */}
              {debouncedSearch && items.length > 0 && (
                <div className="mt-4 text-center">
                  <Link
                    href={
                      activeTab === "FilmTrade"
                        ? `/film-mart?search=${encodeURIComponent(debouncedSearch)}`
                        : activeTab === "Events"
                        ? `/events?search=${encodeURIComponent(debouncedSearch)}`
                        : `/watch-movies?search=${encodeURIComponent(debouncedSearch)}`
                    }
                    onClick={closeModal}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    View all results →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
