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
  <div className="rounded-lg overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col h-full bg-[#1a1d3a]">
    <Link href={`/events/${event._id}`} className="flex flex-col h-full">
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={event.posterImage}
          alt={event.title}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
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

        {/* Status Badge */}
        {event.status && (
          <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded ${
            event.status === 'upcoming' ? 'bg-blue-500' :
            event.status === 'ongoing' ? 'bg-green-500' :
            event.status === 'completed' ? 'bg-gray-500' : 'bg-red-500'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <p className="text-white text-sm font-medium">View Details</p>
        </div>
      </div>

      <div className="p-2 sm:p-3 flex-grow flex flex-col">
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1 mb-1 sm:mb-2 min-h-[1.2em]">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-1">
          <FaMapMarkerAlt className="text-red-500" />
          <span className="line-clamp-1">
            {event.location?.city || 'TBA'}
          </span>
        </div>

        {event.ticketPrice !== undefined && (
          <div className="mt-2 text-[10px] sm:text-xs">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded">
              ₹{event.ticketPrice}+
            </span>
          </div>
        )}
      </div>
    </Link>
  </div>
);

// Main Event Section Component
const EventSection = ({ homeSection, title, viewMoreLink = "/events" }) => {
  const { data: events = [], isLoading, isError } = useGetEventsByHomeSectionQuery({ 
    homeSection, 
    limit: 12 
  });

  if (isLoading) return <SectionSkeleton title={title} />;

  if (isError) return null;

  // Filter events that have the specified homeSection
  const filteredEvents = events.filter(e => e.homeSection === homeSection);

  if (filteredEvents.length === 0) return null;

  return (
    // <section className="py-5">
    <section className="">
      <div className="w-full px-4 md:px-8 ">
        {/* Title */}
        <div className="flex items-center justify-between mb-4 mt-4">
          <h2 className="text-xl md:text-3xl font-bold gradient-text">
            {title}
          </h2>
          <Link
            href={viewMoreLink}
            className="inline-flex items-center font-medium hover:bg-red-300 hover:text-black bg-gray-700 py-2 px-4 rounded-2xl text-xs md:text-sm transition-all duration-300"
          >
            View More <FaChevronRight className="ml-2" />
          </Link>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={12}
          loop={filteredEvents.length > 6}
          navigation
          breakpoints={{
            0: { slidesPerView: 2 },
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
