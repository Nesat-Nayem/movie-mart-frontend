"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, Pause } from "lucide-react";

const FilmMartHeader = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef(null);
  const popupRef = useRef(null);

  const openVideo = () => {
    setIsVideoOpen(true);
    setTimeout(() => {
      popupRef.current?.play();
    }, 200);
  };

  const closeVideo = () => {
    popupRef.current?.pause();
    setIsVideoOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Background Video Banner */}
      <div className="relative w-full">
        <video
          src="/assets/img/movies/movie-video.mp4"
          poster="/assets/img/event-list/2.jpg"
          autoPlay
          loop
          muted
          playsInline
          ref={videoRef}
          className="w-full h-[200px] sm:h-[320px] md:h-[200px] lg:h-[400px] object-cover rounded-b-2xl"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-b-2xl" />

        {/* Play Button Overlay */}
        <button
          onClick={openVideo}
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
          href={"/film-mart"}
          className="bg-black/60 px-3 py-1 rounded-lg text-xs sm:text-sm text-white cursor-pointer hover:bg-black/80 transition"
        >
          Back
        </Link>
      </div>

      {/* Popup Video Player (MX Player Style) */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex items-center justify-center animate-fade-in">
          <div className="relative w-[90%] sm:w-[80%] md:w-[60%]">
            <video
              ref={popupRef}
              src="/assets/img/movies/movie-video.mp4"
              controls
              className="w-full rounded-lg shadow-lg"
            />

            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-5 -right-5 bg-white/20 p-3 rounded-full hover:bg-white/30 transition"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Fade Animation */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FilmMartHeader;
