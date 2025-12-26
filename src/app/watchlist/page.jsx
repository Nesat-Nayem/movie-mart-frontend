"use client";
import React, { useState } from "react";
import { useGetUserWatchlistQuery, useGetWatchlistCountsQuery } from "../../../store/watchlistApi";
import { Play, Calendar, Clock, MapPin, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
// import { useRemoveFromWatchlistMutation } from "@/store/watchlistApi";
import { useRemoveFromWatchlistMutation } from "../../../store/watchlistApi";

const WatchlistPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const getUserId = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user)?._id || null;
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const userId = getUserId();

  const itemType = activeTab === "all" ? undefined : activeTab;

  const { data: watchlistData, isLoading, refetch } = useGetUserWatchlistQuery(
    { itemType, page, limit },
    { skip: !userId }
  );

  const { data: countsData } = useGetWatchlistCountsQuery(undefined, { skip: !userId });
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const handleRemove = async (itemType, itemId) => {
    try {
      await removeFromWatchlist({ itemType, itemId }).unwrap();
      refetch();
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const tabs = [
    { id: "all", label: "All", count: countsData?.total || 0 },
    { id: "watch-video", label: "Videos", count: countsData?.watchVideos || 0 },
    { id: "movie", label: "Movies", count: countsData?.movies || 0 },
    { id: "event", label: "Events", count: countsData?.events || 0 },
  ];

  const renderWatchVideoCard = (item) => {
    const video = item.item;
    if (!video) return null;

    return (
      <Link href={`/watch-movie-deatils?id=${video._id}`} key={item._id}>
        <div className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
          <div className="relative aspect-video">
            <img
              src={video.thumbnailUrl || video.posterUrl || "/assets/img/default-video.jpg"}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Play className="w-4 h-4" />
                  <span>Watch Now</span>
                </div>
              </div>
            </div>
            {video.duration && (
              <span className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {Math.floor(video.duration / 60)}m
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold line-clamp-1 mb-2">{video.title}</h3>
            <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
              {video.videoType && (
                <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded">
                  {video.videoType === 'series' ? 'Series' : 'Movie'}
                </span>
              )}
              {video.genres?.slice(0, 2).map((genre, idx) => (
                <span key={idx}>{genre}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove('watch-video', video._id);
                }}
                className="p-2 hover:bg-red-600/20 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderMovieCard = (item) => {
    const movie = item.item;
    if (!movie) return null;

    return (
      <Link href={`/film-mart-details/${movie._id || movie.id}`} key={item._id}>
        <div className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
          <div className="relative aspect-[2/3]">
            <img
              src={movie.poster || movie.posterUrl || "/assets/img/default-movie.jpg"}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Play className="w-4 h-4" />
                  <span>View Details</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold line-clamp-1 mb-2">{movie.title}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
              {movie.genre && <span>{movie.genre}</span>}
              {movie.rating && (
                <span className="flex items-center gap-1">
                  ⭐ {movie.rating}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove('movie', movie._id || movie.id);
                }}
                className="p-2 hover:bg-red-600/20 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderEventCard = (item) => {
    const event = item.item;
    if (!event) return null;

    return (
      <Link href={`/events/${event._id || event.id}`} key={item._id}>
        <div className="group relative bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all">
          <div className="relative aspect-video">
            <img
              src={event.posterImage || event.bannerImage || "/assets/img/default-event.jpg"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>View Event</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold line-clamp-1 mb-2">{event.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {event.shortDescription || event.description}
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              {event.eventDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
              )}
              {event.location?.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{event.location.city}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove('event', event._id || event.id);
                }}
                className="p-2 hover:bg-red-600/20 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const renderItem = (item) => {
    switch (item.itemType) {
      case 'watch-video':
        return renderWatchVideoCard(item);
      case 'movie':
        return renderMovieCard(item);
      case 'event':
        return renderEventCard(item);
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
            <p className="text-gray-400">Your saved videos, movies, and events</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-pink-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            </div>
          ) : watchlistData?.items?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {watchlistData.items.map(renderItem)}
              </div>

              {/* Pagination */}
              {watchlistData.meta && watchlistData.meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white/5 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page} of {watchlistData.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(watchlistData.meta.totalPages, page + 1))}
                    disabled={page === watchlistData.meta.totalPages}
                    className="px-4 py-2 bg-white/5 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-2">No items in watchlist</h3>
              <p className="text-gray-400 mb-6">
                Start adding videos, movies, and events to your watchlist
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/watch-movies"
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
                >
                  Browse Videos
                </Link>
                <Link
                  href="/film-mart"
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                >
                  Browse Movies
                </Link>
                <Link
                  href="/events"
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default WatchlistPage;
