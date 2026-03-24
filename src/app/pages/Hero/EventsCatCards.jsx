"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moviemart.org/v1/api';

// Fallback categories (used when API is unavailable)
const fallbackCategories = [
  { id: 1, title: "MUSIC", image: "/assets/img/events/1.png", link: "/events?category=music" },
  { id: 2, title: "NIGHTLIFE", image: "/assets/img/events/2.png", link: "/events?category=nightlife" },
  { id: 3, title: "PERFORMANCES", image: "/assets/img/events/3.png", link: "/events?category=performances" },
  { id: 4, title: "FESTS & FAIRS", image: "/assets/img/events/4.png", link: "/events?category=fests & fairs" },
  { id: 5, title: "NAVRATRI", image: "/assets/img/events/5.png", link: "/events?category=navratri" },
  { id: 6, title: "COMEDY", image: "/assets/img/events/6.png", link: "/events?category=comedy" },
  { id: 7, title: "FOOD & DRINKS", image: "/assets/img/events/7.png", link: "/events?category=food & drinks" },
  { id: 8, title: "SOCIAL MIXERS", image: "/assets/img/events/8.png", link: "/events?category=social mixers" },
  { id: 9, title: "SCREENINGS", image: "/assets/img/events/9.png", link: "/events?category=screenings" },
  { id: 10, title: "CONFERENCES", image: "/assets/img/events/10.png", link: "/events?category=conferences" },
  { id: 11, title: "ART EXHIBITIONS", image: "/assets/img/events/11.png", link: "/events?category=art exhibitions" },
  { id: 12, title: "EXPOS", image: "/assets/img/events/12.png", link: "/events?category=expos" },
];

const EventsCatCards = () => {
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/homepage-categories?active=true`);
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            setCategories(
              data.data.map((cat) => ({
                id: cat._id,
                title: cat.title,
                image: cat.image,
                link: cat.link || `/events?category=${cat.title.toLowerCase()}`,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch homepage categories:", error);
        // Use fallback data on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-lg border border-gray-700 
                            flex flex-col items-center justify-center p-3 md:p-4 animate-pulse"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gray-700 rounded-full mb-2" />
              <div className="w-10 h-2 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
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
