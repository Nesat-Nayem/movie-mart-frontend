"use client";

import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa";
import EventCards from "@/app/pages/Hero/EventCards";

const PopularEvents = () => {
  return (
    <section className="flex-1 py-4">
      <div className="w-full px-4 md:px-8  h-full flex flex-col">
        {/* title */}
        <div className="flex md:flex-row items-start md:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            Popular Events
          </h2>
          <Link
            href="/events"
            className="inline-flex items-center font-medium hover:bg-red-300 hover:text-black bg-gray-700 py-2 px-4 rounded-2xl text-xs md:text-sm"
          >
            View More
            <FaChevronRight className="ml-2 text-xs md:text-sm" />
          </Link>
        </div>

        {/* Events */}
        <div className="flex-1">
          <EventCards />
        </div>
      </div>
    </section>
  );
};

export default PopularEvents;
