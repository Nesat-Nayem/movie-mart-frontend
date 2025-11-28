"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useGetMoviesQuery } from "../../../../store/moviesApi";

const MovieCard = ({ movie, rank }) => (
  <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-[300px]">
    {/* Poster */}
    <Link
      href={movie.url || "#"}
      className="block w-full h-full bg-black  items-center justify-center"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </Link>

    {/* Rank Number */}
    <span
      className="absolute z-50 bottom-8 left-1 text-7xl font-extrabold text-transparent"
      style={{ WebkitTextStroke: "10px white" }}
    >
      {rank}
    </span>
    <span
      className="absolute z-50 bottom-8 left-1 text-7xl font-extrabold text-transparent"
      style={{ WebkitTextStroke: "8px black" }}
    >
      {rank}
    </span>

    {/* Title Overlay */}
    <div className="absolute bottom-2 py-2 bg-black/70 backdrop-blur-sm w-full text-center">
      <h3 className="text-sm font-bold text-white truncate px-2">
        {movie.title}
      </h3>
    </div>
  </div>
);

// Skeleton Card for Loading State
const MovieCardSkeleton = () => (
  <div className="relative rounded-xl overflow-hidden shadow-lg w-full h-[300px] animate-pulse bg-gray-700">
    <div className="absolute bottom-2 py-2 w-full bg-gray-800/70"></div>
  </div>
);

export default function MovieList() {
  const { data: moviesData = [], isLoading, isError } = useGetMoviesQuery();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  if (isError) return <div>Error loading movies</div>;
  return (
    <section className="w-full relative px-2 sm:px-4 md:px-6">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        onSwiper={setSwiperInstance}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        }}
        className="pb-10"
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <SwiperSlide key={idx} className="flex justify-center">
                <MovieCardSkeleton />
              </SwiperSlide>
            ))
          : moviesData.map((movie, index) => (
              <SwiperSlide key={movie._id} className="flex justify-center">
                <MovieCard movie={movie} rank={index + 1} />
              </SwiperSlide>
            ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-1 sm:left-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 sm:p-3 shadow hover:bg-white transition cursor-pointer"
      >
        ❮
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-1 sm:right-3 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 sm:p-3 shadow hover:bg-white transition cursor-pointer"
      >
        ❯
      </button>
    </section>
  );
}
