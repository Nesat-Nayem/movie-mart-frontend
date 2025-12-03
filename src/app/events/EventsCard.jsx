"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLanguage, FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import Button from "@/app/components/Button";
import BookTicketDrawer from "./BookTicketDrawer";
import { useGetEventsQuery } from "../../../store/eventsApi";

/* ------------------ Event Card ------------------ */
const EventCard = ({ event, onBook }) => {
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
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                event.status === 'upcoming' ? 'bg-green-500/90 text-white' :
                event.status === 'ongoing' ? 'bg-blue-500/90 text-white' :
                'bg-gray-500/90 text-white'
              }`}>
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
            <span className="line-clamp-1">{event.location?.city || event.eventType}</span>
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
            Book Ticket
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
  const itemsPerPage = 9;

  const { data: eventsData = [], isLoading, isError } = useGetEventsQuery();

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let events = eventsData || [];

    // Filter by date
    if (filters.date?.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const weekendStart = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilSaturday = dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
      weekendStart.setDate(today.getDate() + daysUntilSaturday);
      
      const weekendEnd = new Date(weekendStart);
      weekendEnd.setDate(weekendStart.getDate() + 1);

      events = events.filter((event) => {
        const eventDate = new Date(event.startDate);
        eventDate.setHours(0, 0, 0, 0);

        return filters.date.some((dateFilter) => {
          if (dateFilter === "Today") {
            return eventDate.getTime() === today.getTime();
          }
          if (dateFilter === "Tomorrow") {
            return eventDate.getTime() === tomorrow.getTime();
          }
          if (dateFilter === "This Weekend") {
            return eventDate >= weekendStart && eventDate <= weekendEnd;
          }
          return true;
        });
      });
    }

    // Filter by language
    if (filters.languages?.length > 0) {
      events = events.filter((event) =>
        filters.languages.some(
          (lang) => event.eventLanguage?.toLowerCase() === lang.toLowerCase()
        )
      );
    }

    // Filter by category/type
    if (filters.categories?.length > 0) {
      events = events.filter((event) =>
        filters.categories.some(
          (cat) =>
            event.category?.toLowerCase().includes(cat.toLowerCase()) ||
            event.eventType?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    // Filter by price
    if (filters.price?.length > 0) {
      events = events.filter((event) => {
        const price = event.ticketPrice;
        return filters.price.some((priceRange) => {
          if (priceRange === "Free") return price === 0;
          if (priceRange === "0–500") return price >= 0 && price <= 500;
          if (priceRange === "501–1000") return price > 500 && price <= 1000;
          if (priceRange === "Above 1000") return price > 1000;
          return true;
        });
      });
    }

    return events;
  }, [eventsData, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">Failed to load events</p>
        <Button onClick={() => window.location.reload()} className="bg-pink-500">
          Try Again
        </Button>
      </div>
    );
  }

  /* ---------- Pagination Logic ---------- */
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="rounded-lg">
      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
        </p>
        {Object.values(filters).some(arr => arr?.length > 0) && (
          <span className="text-pink-400 text-xs">Filters applied</span>
        )}
      </div>

      {/* -------- Events Grid -------- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
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

      {/* -------- Pagination Buttons -------- */}
      {filteredEvents.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 text-sm rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
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
