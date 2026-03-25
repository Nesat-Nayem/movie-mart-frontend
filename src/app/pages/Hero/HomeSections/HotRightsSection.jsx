"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetMoviesByHomeSectionQuery } from "../../../../../store/moviesApi";

import "swiper/css";
import { FaChevronRight } from "react-icons/fa";

const HotRightsSection = ({ homeSection, title, viewMoreLink }) => {
  const { data: movies = [] } = useGetMoviesByHomeSectionQuery({
    homeSection,
    limit: 10,
  });

  if (!movies.length) return null;

  return (
    <div className="px-1 md:px-1 lg:px-4 py-4 relative bg-transparent">
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

      <Swiper
        spaceBetween={6}
        breakpoints={{
          0: { slidesPerView: 3 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 7 },
        }}
      >
        {movies.slice(0, 10).map((movie, index) => (
          <SwiperSlide key={movie._id} className="overflow-visible">
            <Link href={`/film-mart-details/${movie._id}`}>
              {/* CARD */}
              <div className="relative group transition-all duration-300 hover:z-20">
                {/* IMAGE */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-[200px] md:h-[300px] object-cover rounded-sm transition-transform duration-500 group-hover:scale-110"
                />

                {/* NUMBER */}
                <span className="absolute -left-2 bottom-2 text-[65px] md:text-[95px] font-black text-white leading-none z-10 pointer-events-none font-serif">
                  {index + 1}
                </span>

                {/* GRADIENT */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* EDGE FADE */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#0b0f1a] to-transparent z-10" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#0b0f1a] to-transparent z-10" />
    </div>
  );
};

export default HotRightsSection;
