"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import Link from "next/link";
import {
  useGetBannersByTypeQuery,
  BANNER_TYPES,
} from "../../../../store/homebannerApi";

const HeroBanner = ({ bannerType = BANNER_TYPES.HOME }) => {
  const { data: bannerData = [] } = useGetBannersByTypeQuery({
    bannerType,
    platform: "web",
  });

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="w-full relative py-4">
      {/* 🔥 MAIN HERO */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        loop
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        className="hero-swiper"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide._id}>
            <Link href={slide.primaryBtnUrl || "#"}>
              {/* FULL WIDTH IMAGE */}
              <div
                className="w-full h-[220px] md:h-[420px] lg:h-[520px] xl:h-[600px] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* LEFT GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔥 THUMBNAIL PREVIEW (BOTTOM RIGHT) */}
      <div className="absolute bottom-6 right-6 w-[65%] md:w-[45%] lg:w-[30%]">
        <Swiper
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          watchSlidesProgress
          className="thumb-swiper pr-10"
        >
          {bannerData.map((slide) => (
            <SwiperSlide key={slide._id}>
              <div
                className="h-14 md:h-16 lg:h-20 rounded-lg overflow-hidden cursor-pointer border border-white/20"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ✅ ONLY CUSTOM ARROWS */}
        <button
          onClick={() => thumbsSwiper?.slidePrev()}
          className="absolute cursor-pointer top-1/2 left-[-12px] z-20 -translate-y-1/2 bg-black/70 text-white rounded-full px-2 py-1 text-sm hover:bg-black"
        >
          ❮
        </button>

        <button
          onClick={() => thumbsSwiper?.slideNext()}
          className="absolute cursor-pointer top-1/2 right-[-12px] z-20 -translate-y-1/2 bg-black/70 text-white rounded-full px-2 py-1 text-sm hover:bg-black"
        >
          ❯
        </button>
      </div>

      {/* 🎨 STYLES */}
      <style jsx>{`
        :global(.hero-swiper .swiper-pagination) {
          bottom: 20px;
        }

        :global(.swiper-pagination-bullet) {
          background: #ccc;
        }

        :global(.swiper-pagination-bullet-active) {
          background: #f59e0b;
        }

        :global(.thumb-swiper .swiper-slide-thumb-active) {
          border: 2px solid #f59e0b;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
