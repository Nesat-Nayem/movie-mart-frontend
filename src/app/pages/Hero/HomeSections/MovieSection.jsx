"use client";

import Link from "next/link";
import React from "react";
import {
  FaChevronRight,
  FaClock,
  FaLanguage,
  FaThumbsUp,
  FaCalendarAlt,
  FaPlay,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetMoviesByHomeSectionQuery } from "../../../../../store/moviesApi";
import { SectionSkeleton, SkeletonCard } from "./SectionSkeleton";
import "swiper/css";
import "swiper/css/navigation";

// Trade Status Badge Config
const tradeStatusConfig = {
  get_it_now: {
    label: "Get It Now",
    bg: "bg-green-500",
    textColor: "text-white",
  },
  sold_out: { label: "Sold Out", bg: "bg-red-600", textColor: "text-white" },
  out_of_stock: {
    label: "Out of Stock",
    bg: "bg-gray-600",
    textColor: "text-white",
  },
  coming_soon: {
    label: "Coming Soon",
    bg: "bg-yellow-500",
    textColor: "text-black",
  },
  limited_offer: {
    label: "Limited Offer",
    bg: "bg-orange-500",
    textColor: "text-white",
  },
  negotiating: {
    label: "Negotiating",
    bg: "bg-blue-500",
    textColor: "text-white",
  },
};

// Format release date
const formatReleaseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Film Card Component
const FilmCard = ({ movie, sectionType }) => {
  const tradeStatus = movie.tradeStatus || "get_it_now";
  const statusConfig =
    tradeStatusConfig[tradeStatus] || tradeStatusConfig.get_it_now;

  const releaseDate = formatReleaseDate(movie.releaseDate);

  const isHot = sectionType === "hot_rights_available";
  const isProfit = sectionType === "profitable_picks";

  return (
    <Link href={`/film-mart-details/${movie._id}`}>
      <div className="group relative rounded-lg md:rounded-2xl overflow-hidden bg-[#14172b] border border-white/5 hover:border-red-500/30 shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:-translate-y-2">
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-[200px] md:h-[300px] object-cover rounded-sm transition-transform duration-500 group-hover:scale-110"
          />

          {/* Cinematic Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
              <FaPlay className="text-white text-sm" />
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`absolute top-3 left-3 ${statusConfig.bg} ${statusConfig.textColor}  text-[8px] md:text-xs px-2 py-1 rounded-md font-medium`}
          >
            {statusConfig.label}
          </span>

          {/* Release Date */}
          {releaseDate && (
            <span className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-[8px] md:text-xs px-2 py-1 rounded-md">
              {releaseDate}
            </span>
          )}
        </div>

        {/* Hide Content for HOT RIGHTS */}
        {!isHot && (
          <div className="p-3">
            {/* Title */}
            <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-1 group-hover:text-red-400 transition">
              {movie.title.slice(0, 50) +
                (movie.title.length > 50 ? "..." : "")}
            </h3>

            {/* Rating */}
            {movie.imdbRating > 0 && (
              <div className="mt-2 inline-flex items-center gap-1 text-[8px] md:text-xs bg-white/10 text-yellow-400 px-2 py-1 rounded-md">
                <FaThumbsUp className="text-green-400 text-[10px]" />
                {movie.imdbRating} Rating
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

// Main Movie Section Component
const MovieSection = ({ homeSection, title, viewMoreLink = "/film-mart" }) => {
  const {
    data: movies = [],
    isLoading,
    isError,
  } = useGetMoviesByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter movies that have the specified homeSection
  const filteredMovies = movies.filter((m) => m.homeSection === homeSection);

  if (filteredMovies.length === 0) return null;

  return (
    // <section className="py-5">
    <section className="">
      <div className="px-1 md:px-1 lg:px-4 py-4">
        {/* Title */}
        <div className="flex justify-between items-center mb-3 px-2">
          <h2 className="text-sm md:text-xl font-bold text-white">{title}</h2>

          <Link
            href={viewMoreLink}
            className="inline-flex items-center  hover:bg-red-300 hover:text-black bg-gray-700 py-1 px-4 rounded-2xl text-[10px]  font-bold"
          >
            View More <FaChevronRight className="ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={6}
          loop={filteredMovies.length > 6}
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
