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
