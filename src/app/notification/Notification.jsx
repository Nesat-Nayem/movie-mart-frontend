"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FaBell, FaFilm, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { useGetEventsQuery } from "../../../store/eventsApi";
import { useGetMoviesQuery } from "../../../store/moviesApi";

const Notification = () => {
  const { data: eventsData, isLoading, isError } = useGetEventsQuery();
  const {
    data: moviesData,
    isLoading: isLoadingMovies,
    isError: isErrorMovies,
  } = useGetMoviesQuery();

  const [cleared, setCleared] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Just now";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Build notifications safely
  const notifications = useMemo(() => {
    if (cleared) return [];

    const movies = moviesData?.data || [];
    const events = eventsData?.data || [];

    const list = [];

    const latestMovies = [...movies].slice(-5).reverse();
    latestMovies.forEach((movie) => {
      list.push({
        id: `movie-${movie._id}`,
        type: "movie",
        title: movie.title,
        message: `A new movie "${movie.title}" has been added.`,
        time: formatDate(movie.releaseDate),
        link: `/film-mart-details/${movie._id}`,
      });
    });

    const latestEvents = [...events].slice(-5).reverse();
    latestEvents.forEach((event) => {
      list.push({
        id: `event-${event._id}`,
        type: "event",
        title: event.name,
        message: `A new event "${event.name}" has been added.`,
        time: formatDate(event.date),
        link: `/events/${event._id}`,
      });
    });

    return list;
  }, [moviesData, eventsData, cleared]);

  if (isError || isErrorMovies) {
    return (
      <section className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load notifications
      </section>
    );
  }

  return (
    <section className="min-h-screen text-white py-4 px-4">
      <div className="max-w-md mx-auto shadow-2xl border border-gray-700 rounded-2xl p-3 bg-white/5 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBell className="text-yellow-400 text-xl" />
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={() => setCleared(true)}
              className="flex cursor-pointer items-center gap-2 text-sm text-red-400 hover:text-red-300"
            >
              <FaTrash />
              Clear
            </button>
          )}
        </div>

        {/* Skeleton Loader */}
        {(isLoading || isLoadingMovies) && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse flex gap-4 bg-gray-800 p-4 rounded-xl"
              >
                <div className="w-6 h-6 bg-gray-700 rounded"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && notifications.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No new notifications
          </p>
        )}

        {/* Notifications */}
        <div className="space-y-4">
          {notifications.map((item) => (
            <Link key={item.id} href={item.link}>
              <div className="flex mb-3 gap-4 items-start bg-gray-800 p-4 rounded-xl hover:bg-white/20 transition cursor-pointer">
                <div>
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
