"use client";

import React, { useState, useEffect, useCallback } from "react";
import Filter from "@/app/events/Filter";
import { FiFilter } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import EventsCards from "./EventsCard";

const EventsList = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [filters, setFilters] = useState({
    date: [],
    languages: [],
    categories: [],
    price: [],
  });

  // Count total active filters
  const totalFilters = Object.values(filters).flat().length;

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Listen for close drawer event from Filter component
  useEffect(() => {
    const handleCloseDrawer = () => setShowDrawer(false);
    window.addEventListener("closeFilterDrawer", handleCloseDrawer);
    return () => window.removeEventListener("closeFilterDrawer", handleCloseDrawer);
  }, []);

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
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 p-4">
          {/* Left filter - visible only on lg+ */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <Filter onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>

          {/* Right events cards */}
          <div className="flex-1 min-w-0">
            <EventsCards filters={filters} />
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-xl lg:hidden z-40 flex items-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all"
        onClick={() => setShowDrawer(true)}
      >
        <FiFilter size={20} />
        {totalFilters > 0 && (
          <span className="bg-white text-pink-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalFilters}
          </span>
        )}
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
            className="absolute bottom-0 left-0 right-0 bg-[#0B1730] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden animate-slide-up"
            style={{
              animation: "slideUp 0.3s ease-out",
            }}
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
              <Filter onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default EventsList;
