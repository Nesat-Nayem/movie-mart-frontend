"use client";

import { useState } from "react";
import Link from "next/link";
import { FaClock, FaLanguage, FaThumbsUp } from "react-icons/fa";

const movies = [
  {
    id: 1,
    title: "Ajey: The Untold Story of a Yogi",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 15m",
    likes: "58.9K",
    image: "/assets/img/movies/11.avif",
    Released: true,
    url: "movie-details",
  },
  {
    id: 2,
    title: "Mirai",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/13.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 3,
    title: "Baaghi 4",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/14.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 4,
    title: "The Bengal Files",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/15.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 5,
    title: "Param Sundari",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/16.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 6,
    title: "Lokah Chapter 1: Chandra",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/17.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 7,
    title: "Heer Express",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/18.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 8,
    title: "Mahavatar Narsimha",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/19.jpg",
    Released: true,
    url: "movie-details",
  },
  {
    id: 9,
    title: "Ek Chatur Naar",
    age: "UA13+",
    language: "Hindi",
    duration: "2h 45m",
    likes: "92.3K",
    image: "/assets/img/movies/20.jpg",
    Released: true,
    url: "movie-details",
  },
];

const FilmCard = ({ movie }) => (
  <div
    className="rounded-lg shadow-md border border-dashed border-gray-400 
               overflow-hidden relative group transition-all duration-300 
               hover:shadow-2xl hover:scale-105"
  >
    <Link href={movie.url}>
      {/* Poster */}
      <div className="relative overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-100 object-cover rounded-t-lg transform transition-transform duration-500 group-hover:scale-110"
        />
        {movie.Released && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Released
          </span>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-[#000000d6] bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-2">
          {movie.title}
        </h3>

        {/* Language + Duration with Icons */}
        <div className="flex items-center justify-between mt-1 ">
          <p className="flex items-center gap-1 text-xs">
            <FaLanguage className="text-red-500" /> {movie.language}
          </p>
          <p className="flex items-center gap-1 text-xs">
            <FaClock className="text-red-500" /> {movie.duration}
          </p>
        </div>

        {/* Rating / Likes */}
        {movie.likes && (
          <div className="flex items-center gap-1 mt-2 text-xs text-white bg-black px-2 py-2 rounded transition-colors duration-300 group-hover:bg-gray-800">
            <FaThumbsUp className="text-green-400" />
            <span>{movie.likes} Likes</span>
          </div>
        )}
      </div>
    </Link>
  </div>
);

const MoviesSection = () => {
  const [selectedLang, setSelectedLang] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const languages = [
    "English",
    "Hindi",
    "Japanese",
    "English 7D",
    "Malayalam",
    "Marathi",
    "Telugu",
    "Garhwali",
    "Manipuri",
    "Tamil",
  ];

  // Filter movies based on selected language
  const filteredMovies = selectedLang
    ? movies.filter((m) => m.language === selectedLang)
    : movies;

  // Pagination setup
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Movies In Delhi-NCR</h2>

      {/* Language tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {languages.map((lang, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedLang(selectedLang === lang ? null : lang);
              setCurrentPage(1); // reset to page 1 when filter changes
            }}
            className={`px-3 py-1 rounded-full text-sm border transition 
              ${
                selectedLang === lang
                  ? "bg-red-500 text-white border-red-500"
                  : "border-red-300 text-red-500 hover:bg-red-100"
              }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="flex justify-between items-center mb-4 bg-[#13162f] py-4 px-4 rounded-2xl border border-dotted border-gray-500">
        <span className="font-medium ">Coming Soon</span>
        <Link href="/movie-list" className="text-sm hover:underline">
          Explore Released Movies →
        </Link>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
        {currentMovies.length > 0 ? (
          currentMovies.map((movie) => (
            <FilmCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No movies available in {selectedLang}
          </p>
        )}
      </div>

      {/* Pagination Controls */}
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
