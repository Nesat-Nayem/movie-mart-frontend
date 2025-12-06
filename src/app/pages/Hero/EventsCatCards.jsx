"use client";
import Link from "next/link";
import React from "react";

// Local categories with images
const categories = [
  { id: 1, title: "MUSIC", image: "/assets/img/events/1.png" },
  { id: 2, title: "NIGHTLIFE", image: "/assets/img/events/2.png" },
  { id: 3, title: "PERFORMANCES", image: "/assets/img/events/3.png" },
  { id: 4, title: "FESTS & FAIRS", image: "/assets/img/events/4.png" },
  { id: 5, title: "NAVRATRI", image: "/assets/img/events/5.png" },
  { id: 6, title: "COMEDY", image: "/assets/img/events/6.png" },
  { id: 7, title: "FOOD & DRINKS", image: "/assets/img/events/7.png" },
  { id: 8, title: "SOCIAL MIXERS", image: "/assets/img/events/8.png" },
  { id: 9, title: "SCREENINGS", image: "/assets/img/events/9.png" },
  { id: 10, title: "CONFERENCES", image: "/assets/img/events/10.png" },
  { id: 11, title: "ART EXHIBITIONS", image: "/assets/img/events/11.png" },
  { id: 12, title: "EXPOS", image: "/assets/img/events/12.png" },
];

const EventsCatCards = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/events?category=${cat.title.toLowerCase()}`}
          >
            <div
              className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-lg border border-gray-700 
                            flex flex-col items-center justify-center p-3 md:p-4 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              {/* Icon */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain mb-2"
              />
              {/* Title */}
              <h3 className="text-[10px] md:text-xs font-bold text-yellow-300 uppercase tracking-wide text-center">
                {cat.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventsCatCards;
