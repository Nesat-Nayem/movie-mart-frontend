"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaClock, FaLanguage, FaThumbsUp, FaStar } from "react-icons/fa";
import { useGetMoviesQuery } from "../../../store/moviesApi";

// Single Movie Card
const FilmCard = ({ movie }) => (
  <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <Link href={`/film-mart-details/${movie._id}`}>
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-fill rounded-t-lg transform transition-transform duration-500 group-hover:scale-110"
        />

        {movie.status === "upcoming" && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Upcoming
          </span>
        )}
      </div>

      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <p className="flex items-center gap-1 text-[10px] sm:text-xs">
            <FaLanguage className="text-red-500 text-[10px]" />
            {movie.languages}
          </p>

          <p className="flex items-center gap-1 text-[10px] sm:text-xs">
            <FaClock className="text-red-500 text-[10px]" />
            {movie.duration}
          </p>
        </div>

        {movie.likes && (
          <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-white bg-black px-2 py-1 rounded">
            <FaThumbsUp className="text-green-400 text-[10px]" />
            <span>{movie.likes} Likes</span>
          </div>
        )}
      </div>
    </Link>
  </div>
);

// Skeleton
const FilmCardSkeleton = () => (
  <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden animate-pulse h-60 bg-gray-700"></div>
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
      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <FilmCardSkeleton key={idx} />
          ))
        ) : currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <FilmCard key={movie._id || movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
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
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-red-500 text-white border-red-500 cursor-pointer"
                  : "hover:bg-red-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesSection;
