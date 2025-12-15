"use client";

import React from "react";
import MovieSection from "./MovieSection";
import EventSection from "./EventSection";
import WatchVideoSection from "./WatchVideoSection";

// Section divider with gradient
const SectionDivider = ({ title, subtitle }) => (
  <div className="w-full px-4 md:px-8 lg:px-12 py-8">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-700"></div>
      </div>
      <div className="relative flex justify-center">
        <div className="bg-[#0a0a0a] px-6 py-2 text-center">
          <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs md:text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AllSections = () => {
  return (
    <div className="home-sections">
      {/* ========== TRADE MOVIES SECTIONS ========== */}
      <SectionDivider 
        title="🎬 Trade Movies" 
        subtitle="Discover film rights and investment opportunities"
      />
      
      {/* Trade Movies Section 1: Hot Rights Available */}
      <MovieSection 
        homeSection="hot_rights_available" 
        title="🔥 Hot Rights Available"
        viewMoreLink="/film-mart?section=hot_rights_available"
      />

      {/* Trade Movies Section 2: Profitable Picks */}
      <MovieSection 
        homeSection="profitable_picks" 
        title="💰 Profitable Picks"
        viewMoreLink="/film-mart?section=profitable_picks"
      />

      {/* Trade Movies Section 3: International Deals */}
      <MovieSection 
        homeSection="international_deals" 
        title="🌍 International Deals"
        viewMoreLink="/film-mart?section=international_deals"
      />

      {/* Trade Movies Section 4: Indie Gems */}
      <MovieSection 
        homeSection="indie_gems" 
        title="💎 Indie Gems"
        viewMoreLink="/film-mart?section=indie_gems"
      />

      {/* ========== LIVE EVENTS SECTIONS ========== */}
      <SectionDivider 
        title="🎭 Live Events & Experiences" 
        subtitle="Book your next unforgettable experience"
      />

      {/* Events Section 1: Trending Events */}
      <EventSection 
        homeSection="trending_events" 
        title="🔥 Trending Events"
        viewMoreLink="/events?section=trending_events"
      />

      {/* Events Section 2: Celebrity Events */}
      <EventSection 
        homeSection="celebrity_events" 
        title="⭐ Celebrity Events"
        viewMoreLink="/events?section=celebrity_events"
      />

      {/* Events Section 3: Exclusive / Invite Only */}
      <EventSection 
        homeSection="exclusive_invite_only" 
        title="🎟️ Exclusive / Invite Only"
        viewMoreLink="/events?section=exclusive_invite_only"
      />

      {/* Events Section 4: Near You */}
      <EventSection 
        homeSection="near_you" 
        title="📍 Near You"
        viewMoreLink="/events?section=near_you"
      />

      {/* ========== WATCH MOVIE SECTIONS ========== */}
      <SectionDivider 
        title="🎥 Watch Movie" 
        subtitle="Stream the latest movies and series"
      />

      {/* Watch Movies Section 1: Trending Now */}
      <WatchVideoSection 
        homeSection="trending_now" 
        title="🔥 Trending Now"
        viewMoreLink="/watch-movies?section=trending_now"
      />

      {/* Watch Movies Section 2: Most Popular */}
      <WatchVideoSection 
        homeSection="most_popular" 
        title="🏆 Most Popular"
        viewMoreLink="/watch-movies?section=most_popular"
      />

      {/* Watch Movies Section 3: Exclusive on Movie Mart */}
      <WatchVideoSection 
        homeSection="exclusive_on_moviemart" 
        title="✨ Exclusive on Movie Mart"
        viewMoreLink="/watch-movies?section=exclusive_on_moviemart"
      />

      {/* Watch Movies Section 4: New Release */}
      <WatchVideoSection 
        homeSection="new_release" 
        title="🆕 New Release"
        viewMoreLink="/watch-movies?section=new_release"
      />
    </div>
  );
};

export default AllSections;
