"use client";

import Link from "next/link";
import React from "react";
import {
  FaChevronRight,
  FaClock,
  FaLanguage,
  FaThumbsUp,
} from "react-icons/fa";
import { useGetMoviesQuery } from "../../../../store/moviesApi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// ----------------------
// Skeleton Loader Card
// ----------------------
const SkeletonCard = () => (
  <div className="rounded-lg border border-dashed border-gray-600 overflow-hidden animate-pulse">
    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gray-700"></div>

    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>

      <div className="flex justify-between mt-2">
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
      </div>

      <div className="h-4 bg-gray-700 rounded w-1/3 mt-3"></div>
    </div>
  </div>
);

// ----------------------
// Film Card (Slider Item)
// ----------------------
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

// ----------------------
// Main Component (Slider)
// ----------------------
const UpcomingMovies = () => {
  const { data: moviesData = [], isLoading, isError } = useGetMoviesQuery();

  console.log(moviesData);
  // ⭐ Skeleton while loading
  if (isLoading)
    return (
      <section className="py-5">
        <div className="max-w-6xl mx-auto w-full px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-3xl font-bold gradient-text">
              Upcoming Movies
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </div>
      </section>
    );

  // ⭐ Error state
  if (isError)
    return (
      <div className="text-center py-5 text-red-400">Error loading movies</div>
    );

  // ⭐ Filter only upcoming movies
  const upcomingMovies = moviesData.filter(
    (movie) => movie.status === "upcoming"
  );

  return (
    <section className="py-5">
      <div className="max-w-6xl mx-auto w-full px-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-4 ">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            Upcoming Movies
          </h2>

          <Link
            href="/film-mart"
            className="inline-flex items-center font-medium hover:bg-red-300 hover:text-black bg-gray-700 py-2 px-4 rounded-2xl text-xs md:text-sm"
          >
            View More <FaChevronRight className="ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 2000 }}
          spaceBetween={10}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {upcomingMovies.map((movie) => (
            <SwiperSlide key={movie._id}>
              <FilmCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default UpcomingMovies;
