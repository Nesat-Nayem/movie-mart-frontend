"use client";

import Link from "next/link";
import React from "react";
import { FaChevronRight, FaPlay, FaClock, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetVideosByHomeSectionQuery } from "../../../../../store/watchVideosApi";
import { SectionSkeleton } from "./SectionSkeleton";
import "swiper/css";
import "swiper/css/navigation";

// Watch Video Card Component
const WatchVideoCard = ({ video }) => (
  <Link href={`/watch-movie-deatils?id=${video._id}`} className="block h-full">
    <div className="relative flex flex-col h-full overflow-hidden rounded-sm group bg-[#0f1226] border border-white/10 hover:border-red-500/40 transition-all duration-500">
      {/* IMAGE */}
      <div className="relative h-65 overflow-hidden flex-shrink-0">
        <img
          src={video.posterUrl || video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* PLAY BUTTON */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-110 transition">
            <FaPlay className="text-white text-xl ml-1" />
          </div>
        </div>

        {/* TYPE */}
        {video.videoType && (
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full capitalize">
            {video.videoType}
          </span>
        )}

        {/* PRICE */}
        <span
          className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full ${
            video.isFree ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {video.isFree ? "Free" : `₹${video.defaultPrice}`}
        </span>

        {/* DURATION */}
        {video.duration > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded flex items-center gap-1">
            <FaClock className="text-[10px]" />
            {Math.floor(video.duration / 60)}:
            {String(video.duration % 60).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow p-4">
        {/* TITLE */}
        <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-2">
          {video.title.slice(0, 10)}...
        </h3>

        {/* GENRE + RATING */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400 min-h-[20px]">
          <span className="line-clamp-1">
            {video.genres?.slice(0, 2).join(", ") || ""}
          </span>

          {video.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span>{video.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </Link>
);

// Main Watch Video Section Component
const WatchVideoSection = ({
  homeSection,
  title,
  viewMoreLink = "/watch-movies",
}) => {
  const { data, isLoading, isError } = useGetVideosByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  const videos = data?.videos || [];

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter videos that have the specified homeSection
  const filteredVideos = videos.filter((v) => v.homeSection === homeSection);

  if (filteredVideos.length === 0) return null;

  return (
    // <section className="py-5">
    <section className="px-1 md:px-1 lg:px-4 py-4 relative bg-transparent">
      <div className="">
        {/* Title */}
        <div className="flex justify-between items-center mb-3 px-2">
          <h2 className="text-sm md:text-xl font-bold text-white">{title}</h2>

          <Link
            href={viewMoreLink}
            className="inline-flex items-center hover:bg-red-300 hover:text-black bg-gray-700 py-1 px-4 rounded-2xl text-[10px] font-bold"
          >
            View More <FaChevronRight className="ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={6}
          loop={filteredVideos.length > 6}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {filteredVideos.map((video) => (
            <SwiperSlide key={video._id}>
              <WatchVideoCard video={video} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default WatchVideoSection;
