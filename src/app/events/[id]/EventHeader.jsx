"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGetEventsQuery } from "../../../../store/eventsApi";

const EventHeader = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const searchParams = useSearchParams();

  // ❌ old: const { id } = useSearchParams()
  // ✅ correct:
  const id = searchParams.get("id");

  const { data: eventsData = [], isLoading, isError } = useGetEventsQuery();

  if (isLoading)
    return <p className="text-center py-10 text-gray-400">Loading events...</p>;

  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load events. Try again.
      </p>
    );

  // Get selected event
  const event = eventsData?.find((item) => item._id === id);

  if (!event)
    return <p className="text-center py-10 text-gray-400">Event not found.</p>;

  return (
    <div className="relative w-full">
      {/* Background Video Banner */}
      <div className="relative w-full">
        <video
          src={"/assets/img/events/event-video.mp4"}
          poster={"/assets/img/event-list/2.jpg"}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[200px] sm:h-[320px] md:h-[200px] lg:h-[400px] object-cover rounded-b-2xl"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl" />

        {/* Play Button Overlay */}
        <button
          onClick={() => setIsVideoOpen(true)}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          <div className="bg-white/20 backdrop-blur-md p-5 sm:p-6 md:p-7 rounded-full hover:scale-110 transition-transform">
            <Play size={40} className="text-white fill-white" />
          </div>
        </button>
      </div>

      {/* Back Button */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
        <Link
          href="/film-mart"
          className="bg-black/60 px-3 py-1 rounded-lg text-xs sm:text-sm text-white hover:bg-black/80 transition"
        >
          Back
        </Link>
      </div>

      {/* Movie Poster (Right Side) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-24 sm:w-28 md:w-36 lg:w-44 shadow-lg z-10">
        <div className="relative">
          <Image
            src={event.posterImage || "/assets/img/event-list/2.jpg"}
            alt={event.title || "Event Poster"}
            width={200}
            height={300}
            className="w-full h-auto rounded-lg object-cover"
          />

          <span className="absolute top-2 right-2 bg-pink-600 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full shadow-md">
            Upcoming
          </span>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black rounded-2xl shadow-lg max-w-3xl w-full relative">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-200"
            >
              <X size={20} className="text-black cursor-pointer" />
            </button>

            <div className="aspect-video">
              {/* Iframe requires YouTube/Vimeo only */}
              <iframe
                width="100%"
                height="100%"
                src={
                  event.trailerUrl ||
                  "https://www.youtube.com/embed/dQw4w9WgXcQ"
                }
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
