"use client";
import React from "react";
import Link from "next/link";
import { FaBell, FaFilm, FaCalendarAlt } from "react-icons/fa";
import { useGetEventsQuery } from "../../../store/eventsApi";
import { useGetMoviesQuery } from "../../../store/moviesApi";

const Notification = () => {
  const { data: eventsData = [], isLoading, isError } = useGetEventsQuery();
  const {
    data: moviesData = [],
    isLoading: isLoadingMovies,
    isError: isErrorMovies,
  } = useGetMoviesQuery();

  // Build dynamic notifications ------------------------------
  const notifications = [];

  // ❗ Add Loading / Error Notifications
  if (isLoading || isLoadingMovies) {
    return (
      <section className="min-h-screen bg-[#0B1730] text-white flex items-center justify-center">
        <p className="text-gray-300">Loading notifications...</p>
      </section>
    );
  }

  if (isError || isErrorMovies) {
    return (
      <section className="min-h-screen bg-[#0B1730] text-white flex items-center justify-center">
        <p className="text-red-400">Failed to load notifications.</p>
      </section>
    );
  }

  // ============================
  // Add Latest Movie Notification
  // ============================
  if (moviesData.length > 0) {
    const latestMovie = moviesData[moviesData.length - 1];

    notifications.push({
      id: `movie-${latestMovie.id}`,
      type: "movie",
      title: latestMovie.title || "New Movie Added!",
      message: `A new movie "${latestMovie.title}" has been added.`,
      time: latestMovie.releaseDate || "Just now",
      link: `/movies/${latestMovie.id}`,
    });
  }

  // ============================
  // Add Latest Event Notification
  // ============================
  if (eventsData.length > 0) {
    const latestEvent = eventsData[eventsData.length - 1];

    notifications.push({
      id: `event-${latestEvent.id}`,
      type: "event",
      title: latestEvent.name || "New Event Added!",
      message: `A new event "${latestEvent.name}" has been added.`,
      time: latestEvent.date || "Just now",
      link: `/events/${latestEvent.id}`,
    });
  }

  return (
    <section className="min-h-screen bg-[#0B1730] text-white py-4 px-4">
      <div className="max-w-md mx-auto shadow-2xl border border-gray-700 rounded-2xl p-3 bg-white/5 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-yellow-400 text-xl" />
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>

        {/* If no notifications */}
        {notifications.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No new notifications.
          </p>
        )}

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((item) => (
            <Link key={item.id} href={item.link}>
              <div className="flex gap-4 items-start mb-2 bg-gray-800 p-4 rounded-xl hover:bg-white/20 transition cursor-pointer">
                <div className="flex-shrink-0">
                  {item.type === "movie" ? (
                    <FaFilm className="text-pink-400 text-xl" />
                  ) : (
                    <FaCalendarAlt className="text-green-400 text-xl" />
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-300">{item.message}</p>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notification;
