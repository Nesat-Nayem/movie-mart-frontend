"use client";

import Link from "next/link";
import React from "react";
import { FaChevronRight, FaClock, FaLanguage, FaThumbsUp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetMoviesByHomeSectionQuery } from "../../../../../store/moviesApi";
import { SectionSkeleton, SkeletonCard } from "./SectionSkeleton";
import "swiper/css";
import "swiper/css/navigation";

// Film Card Component
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="flex items-center gap-1 text-[10px] sm:text-xs">
            <FaLanguage className="text-red-500 text-[10px]" />
            {Array.isArray(movie.languages) ? movie.languages[0] : movie.languages}
          </p>
          <p className="flex items-center gap-1 text-[10px] sm:text-xs">
            <FaClock className="text-red-500 text-[10px]" />
            {movie.duration} min
          </p>
        </div>
        {movie.imdbRating > 0 && (
          <div className="flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-white bg-black px-2 py-1 rounded">
            <FaThumbsUp className="text-green-400 text-[10px]" />
            <span>{movie.imdbRating} Rating</span>
          </div>
        )}
      </div>
    </Link>
  </div>
);

// Main Movie Section Component
const MovieSection = ({ homeSection, title, viewMoreLink = "/film-mart" }) => {
  const { data: movies = [], isLoading, isError } = useGetMoviesByHomeSectionQuery({ 
    homeSection, 
    limit: 12 
  });

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter movies that have the specified homeSection
  const filteredMovies = movies.filter(m => m.homeSection === homeSection);

  if (filteredMovies.length === 0) return null;

  return (
    <section className="py-5">
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            {title}
          </h2>
          <Link
            href={viewMoreLink}
            className="inline-flex items-center font-medium hover:bg-red-300 hover:text-black bg-gray-700 py-2 px-4 rounded-2xl text-xs md:text-sm transition-all duration-300"
          >
            View More <FaChevronRight className="ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={12}
          loop={filteredMovies.length > 6}
          navigation
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {filteredMovies.map((movie) => (
            <SwiperSlide key={movie._id}>
              <FilmCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default MovieSection;
