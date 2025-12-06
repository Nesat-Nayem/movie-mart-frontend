"use client";
import React, { useState, useEffect } from "react";
import Filter from "@/app/film-mart/Filter";
import FilmCard from "./FilmCard";
import { FiFilter } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

const MovieList = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDrawer]);

  return (
    <section className="min-h-screen">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex gap-6 py-4">
          {/* Left filter - visible only on lg+ */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <Filter />
          </div>

          {/* Right film cards */}
          <div className="flex-1 min-w-0">
            <FilmCard />
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-full shadow-xl lg:hidden z-40 flex items-center gap-2 hover:from-red-600 hover:to-pink-700 transition-all"
        onClick={() => setShowDrawer(true)}
      >
        <FiFilter size={20} />
      </button>

      {/* Bottom drawer for mobile */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#13162f] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-700/50">
              <h2 className="text-white text-lg font-semibold">Filters</h2>
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setShowDrawer(false)}
              >
                <FaTimes className="text-white w-4 h-4" />
              </button>
            </div>

            {/* Filter content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
              <Filter />
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default MovieList;
