"use client";

import Link from "next/link";
import { FaChevronRight, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useGetEventsByHomeSectionQuery } from "../../../../../store/eventsApi";

import "swiper/css";

const HorizontalEventSection = ({ homeSection, title, viewMoreLink = "/events" }) => {
  const { data: events = [] } = useGetEventsByHomeSectionQuery({
    homeSection,
    limit: 12,
  });

  if (!events.length) return null;

  return (
    <section className="px-1 md:px-1 lg:px-4 py-4">
      {/* SECTION TITLE */}
      <div className="flex justify-between items-center mb-3 px-2">
        <h2 className="text-sm md:text-xl font-bold text-white">{title}</h2>

        <Link
          href={viewMoreLink}
          className="inline-flex items-center hover:bg-red-300 hover:text-black bg-gray-700 py-1 px-4 rounded-2xl text-[10px] font-bold"
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
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <Link href={`/events/${event._id}`}>
              {/* CARD */}
              <div className="group relative rounded-sm overflow-hidden cursor-pointer">
                {/* IMAGE — horizontal/landscape poster */}
                <img
                  src={event.posterImage}
                  alt={event.title}
                  className="w-full h-25 md:h-35 lg:h-40 xl:h-40 object-cover transition duration-300 group-hover:scale-105"
                />

                {/* DATE BADGE */}
                {event.startDate && (
                  <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[6px] md:text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCalendarAlt className="text-red-400" />
                    {new Date(event.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                )}

                {/* STATUS BADGE */}
                {event.status && (
                  <span
                    className={`absolute top-2 right-2 text-[6px] md:text-[10px] px-2 py-1 rounded-full font-semibold backdrop-blur-md ${
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

                {/* TITLE */}
                <h3 className="text-xs md:text-sm mt-1 font-semibold text-white line-clamp-1">
                  {event.title.slice(0, 50)}...
                </h3>

                {/* LOCATION */}
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                  <FaMapMarkerAlt className="text-red-500 text-[8px]" />
                  <span className="line-clamp-1">
                    {event.location?.city || "Location TBA"}
                  </span>
                </div>

                {/* HOVER GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HorizontalEventSection;
