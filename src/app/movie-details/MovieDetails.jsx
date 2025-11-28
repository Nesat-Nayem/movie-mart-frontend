"use client";

import React, { useState } from "react";
import { CalendarDays, Clock, Play, X } from "lucide-react";
import Button from "@/app/components/Button";
import Image from "next/image";
import MovieDetailsModal from "./MovieDetailsModal";
import DateSelector from "./MovieFilter";

const MovieDetails = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" min-h-screen p-6">
      {/* Header Section */}
      <div className="bg-white/10 rounded-2xl shadow p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster with Play Button */}
          <div className="relative group mx-auto md:mx-0">
            <Image
              src="/assets/img/movies/13.jpg"
              alt="Jolly LLB 3"
              className="w-full sm:w-40 md:w-56 h-50 rounded-lg shadow"
              width={500}
              height={200}
            />
            <button
              onClick={() => setIsOpen(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 p-3 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg hover:scale-110 transition cursor-pointer"
            >
              <Play size={10} className="sm:size-10 text-red-600" />
            </button>
          </div>

          {/* Right Side - Movie Info */}
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Mirai - OFFICIAL TRAILER (HINDI) | Teja S | Manchu M | Ritika N |
              Karthik G
            </h1>
            <p className="mt-1 text-sm sm:text-base">Drama | 2h 37m</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
              <span className="flex items-center gap-1 text-sm sm:text-base">
                <CalendarDays size={18} /> Sep 20 – Sep 26
              </span>
              <span className="flex items-center gap-1 text-sm sm:text-base">
                <Clock size={18} /> Multiple Showtimes
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {["2D", "Hindi"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs sm:text-sm bg-gray-200 rounded-full text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Movie details modal trigger */}
            <div className="mt-4 flex justify-center md:justify-start">
              <MovieDetailsModal />
            </div>
          </div>
        </div>
      </div>

      {/* filter */}

      <DateSelector />

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black rounded-2xl shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            >
              <X size={20} className="text-black" />
            </button>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/6KmxFNjhFz4" // Replace with actual trailer
                title="Jolly LLB 3 Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
