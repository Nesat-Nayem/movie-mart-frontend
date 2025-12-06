"use client";

import Image from "next/image";
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { useGetAdsQuery } from "../../../store/advertisementApi";
import Link from "next/link";

const Advertise = () => {
  const { data: adsData = [], isLoading, isError } = useGetAdsQuery();

  // 🔥 Modern Skeleton Loader
  if (isLoading) {
    return (
      <section className="py-2 lg:py-5">
        <div className="w-full px-4 md:px-8 lg:px-12">
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
      <div className="w-full px-4 md:px-8 lg:px-12">
        {/* ⭐ Mobile Swiper */}
        <div className="block md:hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
          >
            {adsData.map((ad) => (
              <SwiperSlide key={ad._id}>
                <div className="relative w-full h-24 sm:h-28">
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

        {/* ⭐ Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 gap-3">
          {adsData.map((ad) => (
            <div key={ad._id} className="relative w-full h-28 lg:h-36 xl:h-40">
              <Link href={ad.link} target="_blank">
                <Image
                  src={ad?.image || "/assets/img/banner/default.jpg"}
                  alt={ad?.title || "Advertisement Banner"}
                  fill
                  className="object-cover rounded-lg"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertise;
