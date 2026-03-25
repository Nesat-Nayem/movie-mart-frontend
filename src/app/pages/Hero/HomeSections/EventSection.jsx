"use client";

import Link from "next/link";
import React from "react";
import { FaChevronRight, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useGetEventsByHomeSectionQuery } from "../../../../../store/eventsApi";
import { SectionSkeleton } from "./SectionSkeleton";
import "swiper/css";
import "swiper/css/navigation";

// Event Card Component
const EventCard = ({ event }) => (
  <Link href={`/events/${event._id}`} className="block h-full">
    <div className="relative h-full overflow-hidden rounded-lg md:rounded-2xl group bg-[#0f1229] border border-white/10 hover:border-red-400/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={event.posterImage}
          alt={event.title}
          className="w-full h-40 md:h-60 object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-[1px]"
        />

        {/* TOP BADGES */}
        <div className="absolute top-1 md:top-3 left-0  flex-col gap-1 z-10 ">
          {event.startDate && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[6px] md:text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
              <FaCalendarAlt className="text-red-400" />
              {new Date(event.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>

        {/* STATUS */}
        {event.status && (
          <span
            className={`absolute top-1 md:top-3 right-1 text-[6px] md:text-[10px] px-2 py-1 rounded-full font-semibold backdrop-blur-md ${
              event.status === "upcoming"
                ? "bg-blue-500/80"
                : event.status === "ongoing"
                  ? "bg-green-500/80"
                  : "bg-gray-500/80"
            }`}
          >
            {event.status}
          </span>
        )}

        {/* HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
          <span className="px-4 py-2 text-sm font-semibold text-white border border-white/30 rounded-full backdrop-blur-md">
            View Event
          </span>
        </div>
      </div>

      {/* INFO PANEL */}
      <div className="p-2 relative">
        {/* TITLE */}
        <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-1 group-hover:text-red-400 transition">
          {event.title}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
          <FaMapMarkerAlt className="text-red-500" />
          <span className="line-clamp-1">
            {event.location?.city || "Location TBA"}
          </span>
        </div>

        {/* PRICE */}
        {event.ticketPrice !== undefined && (
          <div className="absolute right-1 bottom-12 md:bottom-1">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[6px] md:text-xs px-3 py-1 rounded-full shadow-md">
              ₹{event.ticketPrice}+
            </span>
          </div>
        )}
      </div>

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,0,90,0.15),transparent_70%)]" />
    </div>
  </Link>
);

// Main Event Section Component
const EventSection = ({ homeSection, title, viewMoreLink = "/events" }) => {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useGetEventsByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter events that have the specified homeSection
  const filteredEvents = events.filter((e) => e.homeSection === homeSection);

  if (filteredEvents.length === 0) return null;

  return (
    // <section className="py-5">
    <section className="px-1 md:px-1 lg:px-4 py-4 relative bg-transparent">
      <div className="">
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

        {/* Slider */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={6}
          loop={filteredEvents.length > 6}
          breakpoints={{
            0: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
        >
          {filteredEvents.map((event) => (
            <SwiperSlide key={event._id}>
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EventSection;
