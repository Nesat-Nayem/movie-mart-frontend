"use client";

import Link from "next/link";
import {
  FaChevronRight,
  FaClock,
  FaLanguage,
  FaThumbsUp,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { useGetMoviesByHomeSectionQuery } from "../../../../../store/moviesApi";

import "swiper/css";
import "swiper/css/navigation";

const ProfitableSection = ({ homeSection, title, viewMoreLink }) => {
  const { data: movies = [] } = useGetMoviesByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  if (!movies.length) return null;

  return (
    <section className="px-1 md:px-1 lg:px-4 py-4">
      {/* SECTION TITLE */}
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-sm md:text-xl font-bold text-white">{title}</h2>

        <Link
          href={viewMoreLink}
          className="inline-flex items-center  hover:bg-red-300 hover:text-black bg-gray-700 py-1 px-4 rounded-2xl text-[10px]  font-bold"
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
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <Link href={`/film-mart-details/${movie._id}`}>
              {/* CARD */}
              <div className="group relative rounded-sm overflow-hidden cursor-pointer">
                {/* IMAGE */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-25 md:h-35 lg:h-40 xl:h-40 xxl:h-50 object-cover transition duration-300 group-hover:scale-105"
                />
                {/* TITLE ALWAYS VISIBLE */}
                <h3 className="text-xs md:text-sm mt-1 font-semibold text-white">
                  {movie.title.slice(0, 50)}...
                </h3>

                {/* HOVER GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                {/* CONTENT (BOTTOM) */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {/* HOVER INFO */}
                  <div className="opacity-0 group-hover:opacity-100 transition duration-300">
                    {/* TITLE ALWAYS VISIBLE */}
                    <h3 className="text-xs md:text-sm font-semibold text-white">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {movie.description ||
                        "Watch exciting sports highlights and expert insights."}
                    </p>

                    {/* META */}
                    <div className="flex items-center gap-3 text-xs text-gray-300 mt-2">
                      {movie.languages?.[0] && (
                        <span className="flex items-center gap-1">
                          <FaLanguage className="text-red-400" />
                          {movie.languages[0]}
                        </span>
                      )}

                      {movie.duration && (
                        <span className="flex items-center gap-1">
                          <FaClock className="text-red-400" />
                          {movie.duration}m
                        </span>
                      )}
                    </div>

                    {/* RATING */}
                    {movie.imdbRating > 0 && (
                      <div className="mt-2 text-xs bg-black/70 px-2 py-1 rounded flex items-center gap-1 w-fit">
                        <FaThumbsUp className="text-green-400" />
                        {movie.imdbRating} (Rating)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ProfitableSection;
