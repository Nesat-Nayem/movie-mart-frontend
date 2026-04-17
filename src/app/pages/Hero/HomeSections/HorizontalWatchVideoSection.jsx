"use client";

import Link from "next/link";
import { FaChevronRight, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useGetVideosByHomeSectionQuery } from "../../../../../store/watchVideosApi";

import "swiper/css";

const HorizontalWatchVideoSection = ({
  homeSection,
  title,
  viewMoreLink = "/watch-movies",
}) => {
  const { data, isLoading, isError } = useGetVideosByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  const videos = data?.videos || [];

  if (isLoading || isError) return null;

  const filteredVideos = videos.filter((v) => v.homeSection === homeSection);

  if (!filteredVideos.length) return null;

  return (
    <section className="px-1 md:px-1 lg:px-4 py-4">
      {/* SECTION TITLE */}
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-sm md:text-xl font-bold text-white">{title}</h2>

        <Link
          href={viewMoreLink}
          className="inline-flex items-center hover:bg-red-300 hover:text-black bg-gray-700 py-1 px-4 rounded-2xl text-[10px] font-bold"
        >
          View More <FaChevronRight className="ml-2" />
        </Link>
      </div>

      {/* SLIDER */}
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={6}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {filteredVideos.map((video) => (
          <SwiperSlide key={video._id}>
            <Link href={`/watch-movie-deatils?id=${video._id}`}>
              {/* CARD */}
              <div className="group relative rounded-sm overflow-hidden cursor-pointer">
                {/* IMAGE — horizontal/landscape thumbnail */}
                <img
                  src={video.thumbnailUrl || video.posterUrl}
                  alt={video.title}
                  className="w-full h-25 md:h-35 lg:h-40 xl:h-40 object-cover transition duration-300 group-hover:scale-105"
                />

                {/* FREE / PRICE BADGE */}
                <span
                  className={`absolute top-2 right-2 text-[8px] md:text-xs px-2 py-0.5 rounded-full ${
                    video.isFree ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {video.isFree ? "Free" : `₹${video.defaultPrice}`}
                </span>

                {/* TITLE */}
                <h3 className="text-xs md:text-sm mt-1 font-semibold text-white line-clamp-1">
                  {video.title.slice(0, 50)}...
                </h3>

                {/* GENRE + RATING */}
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                  <span className="line-clamp-1">
                    {video.genres?.slice(0, 2).join(", ") || ""}
                  </span>
                  {video.averageRating > 0 && (
                    <div className="flex items-center gap-0.5">
                      <FaStar className="text-yellow-400 text-[8px]" />
                      <span>{video.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* HOVER GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HorizontalWatchVideoSection;
