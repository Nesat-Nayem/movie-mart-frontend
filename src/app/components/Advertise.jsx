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

  // 🔥 Skeleton Loader (optional)
  if (isLoading) {
    return (
      <section className="py-2 lg:py-5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-2 animate-pulse">
            <div className="h-24 bg-gray-300 rounded-md"></div>
            <div className="h-24 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !adsData.length) {
    return (
      <section className="py-2 lg:py-5">
        <div className="text-center text-gray-500">No ads found</div>
      </section>
    );
  }

  return (
    <section className="py-2 lg:py-5">
      <div className="max-w-6xl mx-auto px-4">
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
                <div className="relative w-full h-20 sm:h-20">
                  <Link href={ad.link} target="_blank">
                    <Image
                      src={ad?.image || "/assets/img/banner/default.jpg"}
                      alt={ad?.title || "Advertisement Banner"}
                      fill
                      className="object-fill rounded-md"
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* ⭐ Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 gap-2">
          {adsData.map((ad) => (
            <div key={ad._id} className="relative w-full h-10 md:h-20 lg:h-32">
              <Link href={ad.link} target="_blank">
                <Image
                  src={ad?.image || "/assets/img/banner/default.jpg"}
                  alt={ad?.title || "Advertisement Banner"}
                  fill
                  className="object-fill rounded-md"
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
