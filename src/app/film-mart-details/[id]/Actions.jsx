"use client";
import React, { useState, useEffect } from "react";
import { Bookmark, Share2 } from "lucide-react";
import ShareModal from "@/components/ShareModal";

const Actions = ({ movie }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  /** Bookmark Load */
  useEffect(() => {
    if (!movie) return;
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarked(saved.some((b) => b._id === movie._id || b.id === movie.id));
  }, [movie]);

  // If no movie, show skeleton buttons
  if (!movie) {
    return (
      <div className="flex items-center gap-3 self-start">
        <div className="h-10 w-24 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg" />
        <div className="h-10 w-10 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-lg" />
      </div>
    );
  }

  const shareURL = typeof window !== "undefined" ? window.location.href : "";

  /** Toggle Bookmark */
  const handleBookmark = () => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const exists = saved.some((b) => b._id === movie._id || b.id === movie.id);

    if (exists) {
      const updated = saved.filter(
        (b) => b._id !== movie._id && b.id !== movie.id
      );
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      setBookmarked(false);
    } else {
      const newItem = {
        _id: movie._id,
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        link: `/movies/details/${movie._id || movie.id}`, // ✅ FIXED
      };
      localStorage.setItem("bookmarks", JSON.stringify([...saved, newItem]));
      setBookmarked(true);
    }
  };

  return (
    <div className="flex items-center gap-3 self-start">
      <button
        onClick={handleBookmark}
        className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
          bookmarked ? "bg-pink-600" : "bg-white/10"
        }`}
      >
        <Bookmark size={16} /> {bookmarked ? "Saved" : "Watchlist"}
      </button>

      <button
        onClick={() => setShareOpen(true)}
        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
      >
        <Share2 size={16} />
      </button>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={movie.title}
        description={movie.synopsis || movie.description || `Check out this amazing movie: ${movie.title}`}
        imageUrl={movie.posterUrl || movie.poster}
        url={shareURL}
        contentType="movie"
      />
    </div>
  );
};

export default Actions;
