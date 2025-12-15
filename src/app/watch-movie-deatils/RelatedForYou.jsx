"use client";

import React from "react";
import Link from "next/link";
import { FaPlay, FaStar, FaHeart } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useGetRelatedVideosQuery } from "../../../store/watchVideosApi";

// Format duration from seconds
const formatDuration = (seconds) => {
  if (!seconds) return "N/A";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

// Loading skeleton
const VideoSkeleton = () => (
  <div className="rounded-xl overflow-hidden bg-gray-800/50 animate-pulse">
    <div className="h-40 sm:h-48 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// Video card component
const VideoCard = ({ video }) => (
  <Link
    href={`/watch-movie-deatils?id=${video._id}`}
    className="group rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
  >
    <div className="relative">
      <img
        src={video.thumbnailUrl || video.posterUrl || "/assets/img/placeholder-video.jpg"}
        alt={video.title}
        className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Duration badge */}
      <span className="absolute bottom-2 left-2 bg-black/80 text-xs text-white px-2 py-0.5 rounded">
        {formatDuration(video.duration)}
      </span>
      {/* Play overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-purple-500/80 backdrop-blur-sm p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <FaPlay className="text-white text-lg ml-0.5" />
        </div>
      </div>
      {/* Premium badge */}
      {video.isPremium && (
        <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          PREMIUM
        </span>
      )}
      {/* Video type badge */}
      {video.videoType === 'series' && (
        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full">
          SERIES
        </span>
      )}
    </div>
    <div className="p-3">
      <h4 className="text-white text-sm font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
        {video.title}
      </h4>
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
        {video.rating > 0 && (
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            {video.rating.toFixed(1)}
          </span>
        )}
        {video.likesCount > 0 && (
          <span className="flex items-center gap-1">
            <FaHeart className="text-pink-500" />
            {video.likesCount}
          </span>
        )}
        {video.genres && video.genres.length > 0 && (
          <span className="text-purple-400 capitalize">
            {video.genres[0]}
          </span>
        )}
      </div>
    </div>
  </Link>
);

const RelatedForYou = ({ currentVideoId, currentVideo }) => {
  // Get related videos based on genres and category
  const { data: relatedVideos = [], isLoading } = useGetRelatedVideosQuery(
    {
      videoId: currentVideoId,
      genres: currentVideo?.genres || [],
      categoryId: currentVideo?.categoryId,
      limit: 12,
    },
    {
      skip: !currentVideoId,
    }
  );

  // Don't render if no related videos
  if (!isLoading && relatedVideos.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 px-4 md:px-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Related For You</h2>
          <p className="text-xs text-gray-400">Based on your current watch</p>
        </div>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {relatedVideos.slice(0, 12).map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {/* View More Link */}
      {relatedVideos.length > 6 && (
        <div className="text-center mt-6">
          <Link
            href="/watch-movie"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            Explore More Videos
            <span className="text-lg">→</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedForYou;
