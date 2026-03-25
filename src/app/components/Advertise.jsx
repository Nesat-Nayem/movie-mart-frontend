"use client";

import Image from "next/image";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useGetAdsQuery } from "../../../store/advertisementApi";
import Link from "next/link";

const Advertise = () => {
  const { data: adsData = [], isLoading, isError } = useGetAdsQuery();

  // 🔥 Modern Skeleton Loader
  if (isLoading) {
    return (
      <section className="py-2 lg:py-5">
        <div className="w-full px-4 md:px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="h-20 md:h-28 lg:h-36 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg" />
            <div className="hidden md:block h-20 md:h-28 lg:h-36 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !adsData.length) {
    return null;
  }

  return (
    <section className="py-2 lg:py-5">
      <div className="w-full px-4 md:px-8 ">
        {/* Swiper */}
        <div className="">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={12}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            className="custom-swiper" // remove pb-8
          >
            {adsData.map((ad) => (
              <SwiperSlide key={ad._id}>
                <div className="relative w-full h-15 md:h-20 lg:h-30 xl:h-30">
                  <Link href={ad.link} target="_blank">
                    <Image
                      src={ad?.image || "/assets/img/banner/default.jpg"}
                      alt={ad?.title || "Advertisement Banner"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Advertise;
