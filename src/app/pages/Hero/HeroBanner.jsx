"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useGetHomeBannerQuery } from "../../../../store/homebannerApi";

// Modern Skeleton slide
const HeroBannerSkeleton = () => (
  <div className="w-full h-[220px] md:h-[400px] lg:h-[480px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-xl relative">
    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-shimmer bg-[length:200%_100%] rounded-b-xl" />
  </div>
);

const HeroBanner = () => {
  const { data: bannerData = [], isLoading, isError } = useGetHomeBannerQuery();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (isError) return <p>Error loading banners...</p>;

  const slides = isLoading
    ? Array.from({ length: 3 }).map((_, idx) => (
        <SwiperSlide key={idx}>
          <HeroBannerSkeleton />
        </SwiperSlide>
      ))
    : bannerData.map((slide) => (
        <SwiperSlide key={slide._id}>
          <Link href={slide.primaryBtnUrl || "#"}>
            <div
              className="w-full h-[180px] md:h-[400px] lg:h-[480px] bg-cover bg-center cursor-pointer rounded-lg"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white p-3 text-sm md:text-base rounded-b-lg">
                {slide.title}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ));

  return (
    <section className="w-full relative px-4 md:px-8 lg:px-12 py-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="rounded-xl overflow-hidden"
      >
        {slides}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-6 md:left-10 lg:left-14 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer"
      >
        ❮
      </button>
      <button
        ref={nextRef}
        className="absolute top-1/2 right-6 md:right-10 lg:right-14 z-10 -translate-y-1/2 bg-white/70 text-black rounded-full p-2 shadow hover:bg-white transition cursor-pointer"
      >
        ❯
      </button>

      {/* Custom pagination style */}
      <style jsx>{`
        :global(.swiper-pagination-bullet) {
          background-color: #ccc;
          opacity: 1;
        }
        :global(.swiper-pagination-bullet-active) {
          background-color: #f59e0b;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
