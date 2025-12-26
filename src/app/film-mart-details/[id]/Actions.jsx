"use client";
import React, { useState, useEffect } from "react";
import { Bookmark, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ShareModal from "@/components/ShareModal";
import {
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useCheckWatchlistStatusQuery,
} from "../../../../store/watchlistApi";

const Actions = ({ movie }) => {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);
  const [optimisticSaved, setOptimisticSaved] = useState(false);

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
  const movieId = movie?._id || movie?.id;

  const { data: watchlistData } = useCheckWatchlistStatusQuery(
    { itemType: 'movie', itemId: movieId },
    { skip: !movieId || !userId }
  );

  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const isSaved = optimisticSaved || watchlistData?.inWatchlist;

  useEffect(() => {
    if (watchlistData?.inWatchlist !== undefined) {
      setOptimisticSaved(watchlistData.inWatchlist);
    }
  }, [watchlistData]);

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

  const handleSaveToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const previousState = optimisticSaved;
    setOptimisticSaved(!previousState);

    try {
      if (previousState) {
        await removeFromWatchlist({ itemType: 'movie', itemId: movieId }).unwrap();
      } else {
        await addToWatchlist({ itemType: 'movie', itemId: movieId }).unwrap();
      }
    } catch (error) {
      setOptimisticSaved(previousState);
      console.error('Save error:', error);
      if (error?.data?.message) {
        alert(error.data.message);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 self-start">
      <button
        onClick={handleSaveToggle}
        className={`px-3 py-2 rounded-lg flex items-center gap-1 transition ${
          isSaved ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-white/10 hover:bg-white/20"
        }`}
      >
        <Bookmark size={16} className={isSaved ? 'fill-white' : ''} /> {isSaved ? "Saved" : "Watchlist"}
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
