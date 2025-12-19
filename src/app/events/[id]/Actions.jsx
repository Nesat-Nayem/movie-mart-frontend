"use client";
import React, { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import ShareModal from "@/components/ShareModal";

const Actions = ({ event }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 self-start">
      {/* Bookmark Button */}
      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg text-sm transition 
          ${
            bookmarked
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-white/10 hover:bg-white/20"
          }`}
      >
        <Bookmark size={16} />
        {bookmarked ? "Saved" : "Watchlist"}
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
