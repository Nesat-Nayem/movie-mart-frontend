"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useGetEventsQuery } from "../../../../store/eventsApi";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

// Modern Skeleton Card
const EventsCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
    </div>
  </div>
);

const EventCards = () => {
  const { data: eventsData = [], isLoading, isError } = useGetEventsQuery();

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

  if (isError) return <div>Error loading events</div>;

  const slides = isLoading
    ? Array.from({ length: 6 }).map((_, idx) => (
        <SwiperSlide key={idx}>
          <EventsCardSkeleton />
        </SwiperSlide>
      ))
    : eventsData.map((event) => (
        <SwiperSlide key={event._id}>
          <Link href={"/event-details"}>
            <div className="rounded-lg shadow-md border border-dashed border-gray-400 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105">
              {/* Poster Image */}
              <div className="relative overflow-hidden">
                <img
                  src={event.posterImage}
                  alt={event.title}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transform transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Date Badge */}
                {event.startDate && (
                  <div className="absolute top-2 left-2 bg-[#0a0a0a] rounded-lg shadow-md px-2 py-1 text-center z-10">
                    <p className="text-xs text-white font-medium">
                      {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <p className="text-white text-sm font-medium">View Details</p>
                </div>
              </div>

              {/* Event Title */}
              <div className="p-2 sm:p-3">
                <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2">
                  {event.title.slice(0, 30)}...
                </h3>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ));

  return (
    <section className="w-full relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
          1536: { slidesPerView: 6 },
        }}
        onSwiper={setSwiperInstance}
        className="pb-10"
      >
        {slides}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button
        ref={prevRef}
        className="cursor-pointer absolute top-1/2 left-0 z-20 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 sm:p-3 shadow hover:bg-white transition"
      >
        ❮
      </button>
      <button
        ref={nextRef}
        className="cursor-pointer absolute top-1/2 right-0 z-20 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 sm:p-3 shadow hover:bg-white transition"
      >
        ❯
      </button>
    </section>
  );
};

export default EventCards;
