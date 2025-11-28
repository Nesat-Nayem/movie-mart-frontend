"use client";
import React, { useState, useEffect } from "react";
import { Bookmark, Share2, X } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

import { useParams } from "next/navigation";
import { useGetMoviesQuery } from "../../../../store/moviesApi";

const Actions = () => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // ✅ FIX: Get ID from dynamic URL
  const { id } = useParams();

  const { data: moviesData = [], isLoading } = useGetMoviesQuery();

  console.log("URL ID =", id);
  console.log("moviesData =", moviesData);

  // ✅ FIX: Match both _id and id
  const movie = moviesData.find((item) => item._id === id || item.id === id);

  console.log("Found Movie =", movie);

  /** Bookmark Load */
  useEffect(() => {
    if (!movie) return;
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarked(saved.some((b) => b._id === movie._id || b.id === movie.id));
  }, [movie]);

  if (isLoading) {
    return <div className="text-white">Loading movies…</div>;
  }

  if (!id) {
    return <div className="text-red-400 mt-4">❌ No ID found in URL</div>;
  }

  if (!movie) {
    return (
      <div className="text-red-400 mt-4">
        ❌ Movie not found <br /> ID: {id}
      </div>
    );
  }

  const shareURL = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this movie: ${movie.title}%0A${shareURL}`;

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
        className="p-2 bg-white/10 rounded-lg"
      >
        <Share2 size={16} />
      </button>

      {shareOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#0B1730] p-6 rounded-xl w-80 relative">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-3 right-3 text-gray-300"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg mb-4">Share this movie</h2>

            <div className="flex justify-between text-white text-xl">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${shareURL}`}
                target="_blank"
                className="p-3 bg-blue-600 rounded-full"
              >
                <FaFacebookF />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                className="p-3 bg-sky-500 rounded-full"
              >
                <FaTwitter />
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareURL}`}
                target="_blank"
                className="p-3 bg-blue-700 rounded-full"
              >
                <FaLinkedinIn />
              </a>

              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                className="p-3 bg-green-500 rounded-full"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://instagram.com"
                className="p-3 bg-pink-500 rounded-full"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;
