"use client";
import React, { useState } from "react";
import Filter from "@/app/events/Filter";
import { FiFilter } from "react-icons/fi";
import EventsCards from "./EventsCard";

const EventsList = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <section>
      <div className="max-w-6xl  mx-auto">
        <div className="flex gap-8 p-4">
          {/* Left filter - visible only on md+ */}
          <div className="hidden lg:block w-1/4">
            <Filter />
          </div>

          {/* Right film cards */}
          <div className="w-full">
            <EventsCards />
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg md:hidden"
        onClick={() => setShowDrawer(true)}
      >
        <FiFilter size={22} />
      </button>

      {/* Bottom drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDrawer(false)}
          ></div>

          {/* Drawer */}
          <div className="relative w-full bg-[#13162f] rounded-t-2xl shadow-lg max-h-[100%] overflow-y-auto transform transition-transform duration-300 translate-y-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold">Filters</h2>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setShowDrawer(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <Filter />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsList;
