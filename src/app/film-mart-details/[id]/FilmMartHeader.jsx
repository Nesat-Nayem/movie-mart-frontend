"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";

const FilmMartHeader = ({ movie }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // If no movie data, show skeleton
  if (!movie) {
    return (
      <div className="relative w-full">
        <div className="w-full h-[200px] sm:h-[320px] md:h-[300px] lg:h-[400px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-b-2xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Background Video Banner */}
      <div className="relative w-full">
        <video
          src={movie?.trailerUrl || "/assets/img/movies/movie-video.mp4"}
          poster={movie?.posterUrl || "/assets/img/movies/1.avif"}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[200px] sm:h-[320px] md:h-[200px] lg:h-[400px] object-cover rounded-b-2xl"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl" />

        {/* Play Button Overlay */}
        <button
          onClick={() => setIsVideoOpen(true)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
        >
          <div className="bg-white/20 backdrop-blur-md p-5 sm:p-6 md:p-7 rounded-full hover:scale-110 transition-transform">
            <Play size={40} className="text-white fill-white" />
          </div>
        </button>
      </div>

      {/* Back Button */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <Link
          href="/film-mart"
          className="bg-black/60 px-3 py-1 rounded-lg text-xs sm:text-sm text-white cursor-pointer hover:bg-black/80 transition"
        >
          Back
        </Link>
      </div>

      {/* Movie Poster (Right Side) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-24 sm:w-28 md:w-36 lg:w-44 shadow-lg z-10">
        <div className="relative">
          <Image
            src={movie?.posterUrl || "/assets/img/movies/13.jpg"}
            alt={movie?.title || "Movie Poster"}
            width={200}
            height={300}
            className="w-full h-auto rounded-lg object-cover"
            unoptimized
          />

          {/* Upcoming Badge */}
          {movie?.status === "upcoming" && (
            <span className="absolute top-2 right-2 bg-pink-600 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full shadow-md">
              {movie?.status}
            </span>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-999">
          <div className="bg-black rounded-2xl shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            >
              <X size={20} className="text-black cursor-pointer" />
            </button>

            {/* Modal Video */}
            <div className="aspect-video">
              <video
                src={movie?.trailerUrl || "/assets/img/movies/movie-video.mp4"}
                controls
                autoPlay
                className="w-full h-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmMartHeader;
