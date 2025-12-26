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

const Actions = ({ event }) => {
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
  const eventId = event?._id || event?.id;

  const { data: watchlistData } = useCheckWatchlistStatusQuery(
    { itemType: 'event', itemId: eventId },
    { skip: !eventId || !userId }
  );

  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();

  const isSaved = optimisticSaved || watchlistData?.inWatchlist;

  useEffect(() => {
    if (watchlistData?.inWatchlist !== undefined) {
      setOptimisticSaved(watchlistData.inWatchlist);
    }
  }, [watchlistData]);

  const handleSaveToggle = async () => {
    if (!userId) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    const previousState = optimisticSaved;
    setOptimisticSaved(!previousState);

    try {
      if (previousState) {
        await removeFromWatchlist({ itemType: 'event', itemId: eventId }).unwrap();
      } else {
        await addToWatchlist({ itemType: 'event', itemId: eventId }).unwrap();
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
      {/* Bookmark Button */}
      <button
        onClick={handleSaveToggle}
        className={`flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg text-sm transition 
          ${
            isSaved
              ? "bg-pink-600 hover:bg-pink-700 text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
      >
        <Bookmark size={16} className={isSaved ? 'fill-white' : ''} />
        {isSaved ? "Saved" : "Watchlist"}
      </button>

      {/* Share Button */}
      <button
        onClick={() => setShareOpen(true)}
        className="p-2 cursor-pointer bg-white/10 rounded-lg hover:bg-white/20 transition"
      >
        <Share2 size={16} />
      </button>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={event?.title || "Event"}
        description={event?.shortDescription || event?.description || `Check out this amazing event: ${event?.title || "Event"}`}
        imageUrl={event?.posterImage || event?.bannerImage}
        url={typeof window !== "undefined" ? window.location.href : ""}
        contentType="event"
      />
    </div>
  );
};

export default Actions;
