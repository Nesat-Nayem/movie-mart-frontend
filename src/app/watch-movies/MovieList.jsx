"use client";
import React, { useState, useEffect } from "react";
import WatchVideosFilter from "./WatchVideosFilter";
import { FiFilter } from "react-icons/fi";
import { FaTimes, FaPlay, FaCrown, FaLanguage, FaStar, FaThumbsUp, FaMapMarkerAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { useGetWatchVideosQuery } from "../../../store/watchVideosApi";
import { detectUserCountry, getPriceForCountry } from "@/services/geolocationService";
import { getCountryByCode } from "@/data/countries";

// Format duration from seconds to readable format
const formatDuration = (seconds) => {
  if (!seconds) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Single Video Card with location-based pricing
const VideoCard = ({ video, userCountry }) => {
  // Get price for user's country
  const priceInfo = getPriceForCountry(
    video.countryPricing || [],
    userCountry?.countryCode,
    video.defaultPrice,
    'INR'
  );

  return (
  <div className="rounded-xl shadow-lg border border-gray-700/50 overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
    <Link href={`/watch-movie-deatils?id=${video._id}`}>
      <div className="relative overflow-hidden">
        <img
          src={video.thumbnailUrl || video.posterUrl || "/assets/img/placeholder-video.jpg"}
          alt={video.title}
          className="w-full h-52 sm:h-64 object-cover rounded-t-xl transform transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Video Type Badge */}
        <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-medium ${
          video.videoType === 'series' ? 'bg-purple-600' : 'bg-blue-600'
        }`}>
          {video.videoType === 'series' ? '📺 Series' : '🎬 Movie'}
        </span>

        {/* Free/Paid Badge with Location-based Price */}
        <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full font-medium ${
          video.isFree ? 'bg-green-600' : 'bg-gradient-to-r from-yellow-600 to-orange-600'
        }`}>
          {video.isFree ? '✓ Free' : (
            <>
              <FaCrown className="inline mr-1" />
              {priceInfo.currencySymbol}{priceInfo.price?.toLocaleString()}
            </>
          )}
        </span>

        {/* Duration Badge */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:scale-110 transition-transform">
            <FaPlay className="text-white text-xl" />
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-semibold line-clamp-2 mb-2 text-white group-hover:text-pink-400 transition-colors">
          {video.title}
        </h3>

        {/* Channel Info */}
        {video.channelId && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={video.channelId.logoUrl || "/assets/img/default-channel.png"}
              alt={video.channelId.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-gray-400 truncate flex items-center gap-1">
              {video.channelId.name}
              {video.channelId.isVerified && <MdVerified className="text-blue-500" />}
            </span>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <p className="flex items-center gap-1">
            <FaLanguage className="text-pink-500" /> 
            {video.languages?.[0] || "N/A"}
          </p>
          <p className="flex items-center gap-1">
            {video.videoType === 'series' && video.totalEpisodes 
              ? `${video.totalEpisodes} Eps`
              : formatDuration(video.duration)
            }
          </p>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center justify-between mt-3">
          {video.averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <FaStar />
              <span>{Number(video.averageRating).toFixed(1)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {video.viewCount > 0 && (
              <span>{video.viewCount.toLocaleString()} views</span>
            )}
            {video.likeCount > 0 && (
              <span className="flex items-center gap-1">
                <FaThumbsUp className="text-green-400" /> {video.likeCount}
              </span>
            )}
          </div>
        </div>

        {/* Genres */}
        {video.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {video.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  </div>
  );
};

// Modern Shimmer Skeleton
const VideoCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/30">
    <div className="h-52 sm:h-64 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer rounded-full" />
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/2" />
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-16" />
        <div className="h-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-16" />
      </div>
    </div>
  </div>
);

const MovieList = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    genre: '',
    language: '',
    videoType: '',
    isFree: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [userCountry, setUserCountry] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const itemsPerPage = 12;

  // Detect user's country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        setLocationLoading(true);
        const country = await detectUserCountry(false, true);
        setUserCountry(country);
      } catch (error) {
        console.error('Failed to detect country:', error);
        // Use default (India)
        setUserCountry({ countryCode: 'IN', currency: 'INR', currencySymbol: '₹', flag: '🇮🇳' });
      } finally {
        setLocationLoading(false);
      }
    };
    detectCountry();
  }, []);

  // Fetch videos with filters
  const { data, isLoading, isError, isFetching } = useGetWatchVideosQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: 'published',
    ...filters,
  });

  const videos = data?.videos || [];
  const meta = data?.meta || { total: 0, totalPages: 1 };

  // Reset page when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showDrawer]);

  return (
    <section className="min-h-screen">
      <div className="w-full px-4 md:px-8 ">
        <div className="flex gap-6 py-4">
          {/* Left filter - visible only on lg+ */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <WatchVideosFilter 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 bg-gradient-to-r from-gray-800/50 to-gray-900/50 py-4 px-5 rounded-xl border border-gray-700/50 backdrop-blur-sm">
              <div>
                <span className="font-semibold text-base sm:text-lg text-white">
                  {isLoading ? 'Loading...' : `${meta.total} ${meta.total === 1 ? 'Video' : 'Videos'} Found`}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Watch premium content from top creators
                  {userCountry && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <FaMapMarkerAlt className="text-pink-400" />
                      <span>{userCountry.flag} Prices in {userCountry.currency}</span>
                    </span>
                  )}
                </p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange({ sortBy, sortOrder });
                  }}
                  className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="viewCount-desc">Most Viewed</option>
                  <option value="averageRating-desc">Top Rated</option>
                  <option value="defaultPrice-asc">Price: Low to High</option>
                  <option value="defaultPrice-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { label: 'All', value: '' },
                { label: '🎬 Movies', value: 'single' },
                { label: '📺 Series', value: 'series' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange({ videoType: type.value })}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filters.videoType === type.value
                      ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
              <button
                onClick={() => handleFilterChange({ isFree: filters.isFree === 'true' ? '' : 'true' })}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filters.isFree === 'true'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                ✓ Free Only
              </button>
            </div>

            {/* Error State */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-red-500 text-lg">Error loading videos</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Videos Grid */}
            {!isError && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {isLoading || isFetching ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <VideoCardSkeleton key={idx} />
                  ))
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <VideoCard key={video._id} video={video} userCountry={userCountry} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-gray-400 text-lg">No videos found</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-white"
                >
                  ← Prev
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(meta.totalPages, 5))].map((_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 text-sm rounded-lg transition-all font-medium ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg"
                            : "border border-gray-600 hover:bg-white/5 text-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, meta.totalPages))}
                  disabled={currentPage === meta.totalPages}
                  className="px-4 py-2 text-sm border border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-white"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 rounded-full shadow-xl lg:hidden z-40 flex items-center gap-2 hover:from-red-600 hover:to-pink-700 transition-all"
        onClick={() => setShowDrawer(true)}
      >
        <FiFilter size={20} />
      </button>

      {/* Bottom drawer for mobile */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#13162f] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            {/* Drawer Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-4 pb-3 border-b border-gray-700/50">
              <h2 className="text-white text-lg font-semibold">Filters</h2>
              <button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                onClick={() => setShowDrawer(false)}
              >
                <FaTimes className="text-white w-4 h-4" />
              </button>
            </div>

            {/* Filter content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
              <WatchVideosFilter 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onApply={() => setShowDrawer(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default MovieList;
