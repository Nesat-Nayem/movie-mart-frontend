"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaClock, FaLanguage, FaThumbsUp, FaFilm, FaStar, FaFilter } from "react-icons/fa";
import { useGetMoviesQuery } from "../../../store/moviesApi";

/* ------------------ Film Card ------------------ */
const FilmCard = ({ movie }) => {
  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'Upcoming' };
      case 'released':
        return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'Released' };
      case 'in_production':
        return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'In Production' };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge(movie.status);

  return (
    <div className="rounded-xl shadow-md border border-gray-700/50 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-500/30 bg-[#1a1d3a]">
      <Link href={`/film-mart-details/${movie._id}`}>
        <div className="relative overflow-hidden aspect-[2/3]">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover transform transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
              <FaFilm className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {statusBadge && (
            <span className={`absolute top-2 left-2 ${statusBadge.bg} text-white text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium shadow-lg`}>
              {statusBadge.text}
            </span>
          )}

          {/* Rating Badge */}
          {movie.imdbRating > 0 && (
            <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] sm:text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
              <FaStar className="w-2.5 h-2.5" />
              {movie.imdbRating.toFixed(1)}
            </span>
          )}

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {movie.genres.slice(0, 2).map((genre, idx) => (
                  <span key={idx} className="bg-white/20 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded">
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2 text-white">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <p className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
              <FaLanguage className="text-red-500 text-[10px]" />
              {Array.isArray(movie.languages)
                ? movie.languages.slice(0, 2).join(", ")
                : movie.languages}
            </p>

            {movie.duration && (
              <p className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                <FaClock className="text-red-500 text-[10px]" />
                {movie.duration} min
              </p>
            )}
          </div>

          {movie.formats && movie.formats.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.formats.slice(0, 3).map((format, idx) => (
                <span key={idx} className="bg-red-500/20 text-red-400 text-[9px] px-1.5 py-0.5 rounded border border-red-500/30">
                  {format}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

/* ------------------ Movies Section ------------------ */
const MoviesSection = ({ filters = { languages: [], genres: [], formats: [] } }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Build query params — server handles search/filter where possible
  const queryParams = useMemo(() => {
    const params = { page: currentPage, limit: 9 };
    // Pass single genre/language to API if only one selected (API supports single value)
    if (filters.genres?.length === 1) params.genre = filters.genres[0];
    if (filters.languages?.length === 1) params.language = filters.languages[0];
    if (filters.formats?.length === 1) params.format = filters.formats[0];
    return params;
  }, [currentPage, filters]);

  const { data, isLoading, isError } = useGetMoviesQuery(queryParams);

  const movies = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalCount = data?.meta?.total ?? 0;

  // Client-side filter for multi-select (API only supports single value per filter)
  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filters.languages?.length > 1) {
      result = result.filter((movie) => {
        const movieLangs = Array.isArray(movie.languages) ? movie.languages : [movie.languages];
        return filters.languages.some((lang) => movieLangs.includes(lang));
      });
    }
    if (filters.genres?.length > 1) {
      result = result.filter((movie) => {
        const movieGenres = Array.isArray(movie.genres) ? movie.genres : [movie.genres];
        return filters.genres.some((genre) => movieGenres.includes(genre));
      });
    }
    if (filters.formats?.length > 1) {
      result = result.filter((movie) => {
        const movieFormats = Array.isArray(movie.formats) ? movie.formats : [movie.formats];
        return filters.formats.some((format) => movieFormats.includes(format));
      });
    }

    return result;
  }, [movies, filters]);

  const currentMovies = filteredMovies;

  // Count active filters
  const totalFilters = Object.values(filters).flat().length;

  // Loading state with modern shimmer skeleton
  if (isLoading) {
    return (
      <div className="rounded-lg">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-4 bg-gray-800/50 py-3 px-4 rounded-xl">
          <div className="h-5 w-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-4 w-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
              <div className="aspect-[2/3] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
              <div className="p-3 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
                  <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
                </div>
                <div className="flex gap-1">
                  <div className="h-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded w-12" />
                  <div className="h-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="rounded-lg p-8 text-center">
        <FaFilm className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Failed to load movies. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-4 bg-[#13162f] py-3 px-4 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm sm:text-base text-white">
            {totalCount} {totalCount === 1 ? 'Movie' : 'Movies'} Found
          </span>
          {totalFilters > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
              <FaFilter className="w-2.5 h-2.5" />
              {totalFilters} filter{totalFilters > 1 ? 's' : ''} applied
            </span>
          )}
        </div>
        <Link href="#" className="text-xs sm:text-sm text-red-400 hover:text-red-300 hover:underline transition-colors">
          Explore All →
        </Link>
      </div>

      {/* Movies Grid */}
      {currentMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {currentMovies.map((movie) => (
            <FilmCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <FaFilm className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No movies found</p>
          <p className="text-gray-500 text-sm">
            {totalFilters > 0 
              ? "Try adjusting your filters to find more movies" 
              : "No movies available at the moment"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-white"
          >
            Prev
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              // Show limited page numbers
              if (
                i === 0 ||
                i === totalPages - 1 ||
                (i >= currentPage - 2 && i <= currentPage)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-sm rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        : "border border-gray-600 hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              } else if (i === currentPage - 3 || i === currentPage + 1) {
                return <span key={i} className="text-gray-500 px-1">...</span>;
              }
              return null;
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
