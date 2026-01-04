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
  <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105">
    <Link href={`/watch-movie-deatils?id=${video._id}`}>
      <div className="relative overflow-hidden">
        <img
          src={video.posterUrl || video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <FaPlay className="text-white text-lg sm:text-xl ml-1" />
          </div>
        </div>

        {/* Video Type Badge */}
        {video.videoType && (
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded capitalize">
            {video.videoType}
          </span>
        )}

        {/* Price/Free Badge */}
        <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
          video.isFree ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {video.isFree ? 'Free' : `₹${video.defaultPrice}`}
        </span>

        {/* Duration */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <FaClock className="text-[10px]" />
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between mt-1">
          {video.genres && video.genres.length > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">
              {video.genres.slice(0, 2).join(', ')}
            </span>
          )}
          
          {video.averageRating > 0 && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs">
              <FaStar className="text-yellow-400" />
              <span>{video.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {video.ageRating && (
          <div className="mt-2">
            <span className="text-[10px] sm:text-xs bg-gray-700 text-white px-2 py-0.5 rounded">
              {video.ageRating}
            </span>
          </div>
        )}
      </div>
    </Link>
  </div>
);

// Main Watch Video Section Component
const WatchVideoSection = ({ homeSection, title, viewMoreLink = "/watch-movies" }) => {
  const { data, isLoading, isError } = useGetVideosByHomeSectionQuery({ 
    homeSection, 
    limit: 12 
  });

  const videos = data?.videos || [];

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter videos that have the specified homeSection
  const filteredVideos = videos.filter(v => v.homeSection === homeSection);

  if (filteredVideos.length === 0) return null;

  return (
    // <section className="py-5">
    <section className="">
      <div className="w-full px-4 md:px-8 ">
        {/* Title */}
        <div className="flex items-center justify-between mb-4 mt-4">
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
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={12}
          loop={filteredVideos.length > 6}
          navigation
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
