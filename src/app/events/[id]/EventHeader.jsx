"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, ArrowLeft, Share2 } from "lucide-react";
import { FaTicketAlt } from "react-icons/fa";

const EventHeader = ({ event }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-pink-500';
    }
  };

  return (
    <div className="relative w-full">
      {/* Background Banner */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] overflow-hidden rounded-b-3xl">
        {/* Background Image */}
        {event?.posterImage ? (
          <Image
            src={event.posterImage}
            alt={event?.title || "Event"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 flex items-center justify-center">
            <FaTicketAlt className="w-20 h-20 text-white/20" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1730] via-[#0B1730]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1730]/80 via-transparent to-transparent" />

        {/* Play Button (if video available) */}
        {event?.trailerUrl && (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <div className="bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-full hover:scale-110 transition-transform border border-white/30">
              <Play size={32} className="text-white fill-white" />
            </div>
          </button>
        )}
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/events"
          className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full text-sm text-white hover:bg-black/60 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </div>

      {/* Share Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: event?.title,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          className="bg-black/40 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/60 transition-all"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Event Poster Card */}
      <div className="absolute -bottom-16 left-4 sm:left-6 w-28 sm:w-32 md:w-36 shadow-2xl z-10">
        <div className="relative rounded-xl overflow-hidden border-4 border-[#0B1730]">
          {event?.posterImage ? (
            <Image
              src={event.posterImage}
              alt={event?.title || "Event Poster"}
              width={200}
              height={300}
              className="w-full aspect-[2/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gradient-to-br from-pink-500/50 to-purple-600/50 flex items-center justify-center">
              <FaTicketAlt className="w-10 h-10 text-white/50" />
            </div>
          )}

          {/* Status Badge */}
          {event?.status && (
            <span className={`absolute top-2 left-2 ${getStatusColor(event.status)} text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full shadow-md capitalize`}>
              {event.status}
            </span>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B1730] rounded-2xl shadow-2xl max-w-4xl w-full relative overflow-hidden">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 z-10 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>

            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={event?.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                title="Event Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHeader;
