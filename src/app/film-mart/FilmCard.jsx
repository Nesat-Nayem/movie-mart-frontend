"use client";

import { useState } from "react";
import Link from "next/link";
import { FaClock, FaLanguage, FaThumbsUp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useGetMoviesQuery } from "../../../store/moviesApi";

/* ------------------ Film Card ------------------ */
const FilmCard = ({ movie }) => (
  <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <Link href={`/film-mart-details/${movie._id}`}>
      <div className="relative overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-60 sm:h-90 object-fill rounded-t-lg transform transition-transform duration-500 group-hover:scale-110"
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
            {Array.isArray(movie.languages)
              ? movie.languages.join(", ")
              : movie.languages}
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

/* ------------------ Movies Section ------------------ */
const MoviesSection = () => {
  const [selectedLang, setSelectedLang] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: moviesData = [] } = useGetMoviesQuery();

  /* --- Ensure movies array is always safe --- */
  const movies = moviesData || [];

  /* --- Generate Unique Languages from API --- */
  const languages =
    movies.length > 0
      ? [...new Set(movies.flatMap((m) => m.languages || []))]
      : [];

  /* --- Filter movies by selected language --- */
  const filteredMovies = selectedLang
    ? movies.filter((m) =>
        Array.isArray(m.languages)
          ? m.languages.includes(selectedLang)
          : m.languages === selectedLang
      )
    : movies;

  /* --- Pagination Logic --- */
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="rounded-lg">
      {/* Language Slider */}
      <Swiper spaceBetween={10} slidesPerView="auto" freeMode className="mb-4">
        {languages.map((lang, idx) => (
          <SwiperSlide key={idx} style={{ width: "auto" }}>
            <button
              onClick={() => {
                setSelectedLang(selectedLang === lang ? null : lang);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm border transition
                ${
                  selectedLang === lang
                    ? "bg-red-500 text-white border-red-500"
                    : "border-red-300 text-red-500 hover:bg-red-100"
                }`}
            >
              {lang}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Coming Soon */}
      <div className="flex justify-between items-center mb-3 sm:mb-4 bg-[#13162f] py-2 sm:py-4 px-3 sm:px-4 rounded-2xl border border-dotted border-gray-500">
        <span className="font-medium text-sm sm:text-base">Coming Soon</span>
        <Link href="#" className="text-xs sm:text-sm hover:underline">
          Explore Upcoming Movies →
        </Link>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-2">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <FilmCard key={movie._id} movie={movie} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center text-sm">
            No movies available in {selectedLang}
          </p>
        )}
      </div>

      {/* Pagination */}
      {filteredMovies.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 sm:px-3 text-xs sm:text-sm border rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 py-1 sm:px-3 text-xs sm:text-sm border rounded ${
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
            className="px-2 py-1 sm:px-3 text-xs sm:text-sm border rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MoviesSection;
