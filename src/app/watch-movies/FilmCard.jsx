"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaClock, FaLanguage, FaThumbsUp, FaStar } from "react-icons/fa";
import { useGetMoviesQuery } from "../../../store/moviesApi";

// Single Movie Card
const FilmCard = ({ movie }) => (
  <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <Link href={movie.url || "/watch-movie-deatils"}>
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-60 sm:h-80  object-fill rounded-t-lg transform transition-transform duration-500 group-hover:scale-110"
        />
        {movie.Released && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Released
          </span>
        )}

        <div className="absolute inset-0 bg-[#000000d6] flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-2">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mt-1 text-xs">
          <p className="flex items-center gap-1">
            <FaLanguage className="text-red-500" /> {movie.language || "N/A"}
          </p>
          <p className="flex items-center gap-1">
            <FaClock className="text-red-500" /> {movie.duration || "N/A"}
          </p>
        </div>

        {/* Rating */}
        {movie.rating != null && !isNaN(movie.rating) && (
          <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
            <FaStar />
            {Number(movie.rating).toFixed(1)}
          </div>
        )}

        {/* Likes */}
        {movie.likes != null && (
          <div className="flex items-center gap-1 mt-2 text-xs text-white bg-black px-2 py-1 rounded transition-colors duration-300 group-hover:bg-gray-800">
            <FaThumbsUp className="text-green-400" /> {movie.likes} Likes
          </div>
        )}
      </div>
    </Link>
  </div>
);

// Modern Shimmer Skeleton
const FilmCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
    <div className="h-60 sm:h-80 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-3 space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
      </div>
      <div className="h-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
    </div>
  </div>
);

const MoviesSection = () => {
  const { data: moviesData = [], isLoading, isError } = useGetMoviesQuery();
  const [selectedLang, setSelectedLang] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic unique languages
  const languages = useMemo(() => {
    const langs = moviesData.map((m) => m.language).filter(Boolean);
    return [...new Set(langs)];
  }, [moviesData]);

  // Filter by selected language
  const filteredMovies = selectedLang
    ? moviesData.filter((m) => m.language === selectedLang)
    : moviesData;

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isError) return <p className="text-red-500">Error loading movies</p>;

  return (
    <div className="rounded-lg">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-4 bg-[#13162f] py-3 px-4 rounded-xl border border-gray-700/50">
        <span className="font-medium text-sm sm:text-base text-white">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'Movie' : 'Movies'} Found
        </span>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <FilmCardSkeleton key={idx} />
          ))
        ) : currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <FilmCard key={movie._id || movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-16">
            No movies available{selectedLang ? ` in ${selectedLang}` : ""}
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredMovies.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-white"
          >
            Prev
          </button>
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 text-sm rounded-lg transition-all ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                      : "border border-gray-600 hover:bg-white/5 text-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesSection;
