"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaLanguage,
  FaRupeeSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import Button from "@/app/components/Button";
import BookTicketDrawer from "./BookTicketDrawer";
import { useGetEventsQuery } from "../../../store/eventsApi";

/* ------------------ Event Card ------------------ */
const EventCard = ({ event, onBook }) => {
  const eventCategory =
    event.eventCategories && event.eventCategories.length > 0
      ? event.eventCategories[0]
      : null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className="rounded-xl shadow-md border border-gray-700/50 bg-white/5 backdrop-blur-sm
        overflow-hidden relative group transition-all duration-300 
        hover:shadow-2xl hover:scale-[1.02] hover:border-pink-500/30"
    >
      <Link href={`/events/${event._id}`}>
        <div className="relative overflow-hidden aspect-[3/4]">
          {event.posterImage ? (
            <Image
              src={event.posterImage}
              alt={event.title}
              fill
              className="object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center">
              <FaTicketAlt className="text-white/30 w-12 h-12" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Status Badge */}
          {event.status && (
            <div className="absolute top-2 left-2">
              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                  event.status === "upcoming"
                    ? "bg-green-500/90 text-white"
                    : event.status === "ongoing"
                      ? "bg-blue-500/90 text-white"
                      : "bg-gray-500/90 text-white"
                }`}
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute top-2 right-2 bg-white/90 text-gray-800 rounded-lg px-2 py-1 text-center">
            <p className="text-xs font-bold">{formatDate(event.startDate)}</p>
          </div>

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 
              transition-opacity duration-300 group-hover:opacity-100"
          >
            <span className="text-white text-sm font-medium bg-pink-500 px-4 py-2 rounded-full">
              View Details
            </span>
          </div>
        </div>
      </Link>

      <div className="p-3">
        <h3
          className="text-sm font-semibold line-clamp-2 mb-2 text-white"
          title={event.title}
        >
          {event.title}
        </h3>

        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <FaMapMarkerAlt className="text-pink-400 w-3 h-3" />
            <span className="line-clamp-1">
              {event.location?.city || event.eventType}
            </span>
          </p>

          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-[11px] text-gray-400">
              <FaLanguage className="text-pink-400 w-3 h-3" />
              {event.eventLanguage || "Hindi"}
            </p>
            <p className="flex items-center gap-0.5 text-sm font-semibold text-green-400">
              <FaRupeeSign className="w-3 h-3" />
              {event.ticketPrice}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              onBook();
            }}
            className="w-full text-xs py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            {eventCategory ? `Book ${eventCategory}` : "Book Ticket"}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Events List + Pagination with Filtering ------------------ */
const EventsCards = ({ filters = {} }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Build query params for server-side pagination + filters
  const queryParams = useMemo(() => {
    const params = { page: currentPage, limit: itemsPerPage };
    if (filters.languages?.length > 0) params.language = filters.languages.join(",");
    if (filters.categories?.length > 0) params.category = filters.categories.join(",");
    if (filters.price?.length > 0) params.price = filters.price.join(",");
    if (filters.date?.length > 0) params.date = filters.date.join(",");
    return params;
  }, [currentPage, itemsPerPage, filters]);

  const { data: eventsResponse, isLoading, isError } = useGetEventsQuery(queryParams);

  const events = eventsResponse?.data || [];
  const meta = eventsResponse?.meta || { page: 1, limit: itemsPerPage, total: 0, totalPages: 1 };
  const totalPages = meta.totalPages || 1;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Modern shimmer skeleton loading
  if (isLoading) {
    return (
      <div className="rounded-lg">
        {/* Header skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-28 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-3 w-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm"
            >
              <div className="aspect-[3/4] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
              <div className="p-3 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/2" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
                    <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
                  </div>
                </div>
                <div className="h-8 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">Failed to load events</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-pink-500"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const nextPage = () => goToPage(Math.min(currentPage + 1, totalPages));
  const prevPage = () => goToPage(Math.max(currentPage - 1, 1));

  // Build visible page numbers (max 5, sliding window)
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="rounded-lg">
      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          <span className="text-white font-medium">{meta.total}</span> event{meta.total !== 1 ? "s" : ""} found
        </p>
        <div className="flex items-center gap-3">
          {Object.values(filters).some((arr) => arr?.length > 0) && (
            <span className="text-pink-400 text-xs">Filters applied</span>
          )}
          {totalPages > 1 && (
            <span className="text-gray-500 text-xs">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* -------- Events Grid -------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event._id || event.id}
              event={event}
              onBook={() => setSelectedEvent(event)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <FaTicketAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No events found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* -------- Pagination -------- */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          {/* Prev */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
              bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
              disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            ← Prev
          </button>

          {/* First page + ellipsis */}
          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="w-10 h-10 text-sm rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="text-gray-500 text-sm px-1">…</span>
              )}
            </>
          )}

          {/* Page number buttons */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-10 h-10 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                currentPage === pageNum
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 border border-pink-400/50"
                  : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page + ellipsis */}
          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="text-gray-500 text-sm px-1">…</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="w-10 h-10 text-sm rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl
              bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
              disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* Ticket Drawer */}
      {selectedEvent && (
        <BookTicketDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsCards;
