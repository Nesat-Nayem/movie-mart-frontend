"use client";

import { useState } from "react";
import Link from "next/link";
import { FaLanguage, FaRupeeSign } from "react-icons/fa";
import Button from "@/app/components/Button";
import BookTicketDrawer from "./BookTicketDrawer";
import { useGetEventsQuery } from "../../../store/eventsApi";

/* ------------------ Event Card ------------------ */
const EventCard = ({ event, onBook }) => (
  <div
    className="rounded-lg shadow-md border border-dashed border-gray-400 
      overflow-hidden relative group transition-all duration-300 
      hover:shadow-2xl hover:scale-105"
  >
    <Link href={`/events/${event._id}`}>
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 
            object-fill rounded-t-lg transform transition-transform 
            duration-500 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-[#000000d6] bg-opacity-50 
            flex items-center justify-center opacity-0 
            transition-opacity duration-500 group-hover:opacity-100"
        >
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>
    </Link>

    <div className="p-2 sm:p-3">
      <h3
        className="text-xs sm:text-sm font-semibold line-clamp-2 mb-1 sm:mb-2"
        title={event.title} // Tooltip on hover
      >
        {event.title.length > 30
          ? event.title.slice(0, 25) + "..."
          : event.title}
      </h3>

      <div className="flex items-center justify-between mt-1">
        <p className="flex items-center gap-1 text-[10px] sm:text-xs">
          <FaLanguage className="text-red-500 text-[10px]" />
          {event.eventType}
        </p>
        <p className="flex items-center gap-1 text-[10px] sm:text-xs">
          <span className="text-red-500 text-[10px]">🎫</span>
          <FaRupeeSign className="text-red-500 text-[10px]" />
          {event.ticketPrice} /-
        </p>
      </div>

      <div className="mt-2 sm:mt-3">
        <Button onClick={onBook} className="w-full text-xs sm:text-sm">
          Book Ticket
        </Button>
      </div>
    </div>
  </div>
);

/* ------------------ Events List + Pagination ------------------ */
const EventsCards = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // change here for 6, 9, 12 items per page

  const { data: eventsData = [], isLoading, isError } = useGetEventsQuery();

  if (isLoading)
    return <p className="text-center py-10 text-gray-400">Loading events...</p>;

  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load events. Try again.
      </p>
    );

  const events = eventsData || [];

  /* ---------- Pagination Logic ---------- */
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="rounded-lg">
      {/* -------- Events Grid -------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-2">
        {currentEvents.length > 0 ? (
          currentEvents.map((event) => (
            <EventCard
              key={event._id || event.id}
              event={event}
              onBook={() => setSelectedEvent(event)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-6">
            No events found.
          </p>
        )}
      </div>

      {/* -------- Pagination Buttons -------- */}
      {events.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* Previous */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {/* Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 text-sm border rounded 
                ${currentPage === i + 1 ? "bg-red-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40"
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
