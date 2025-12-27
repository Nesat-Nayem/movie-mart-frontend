"use client";

import React from "react";
import Link from "next/link";
import { FaLanguage, FaThumbsUp, FaStar, FaPlay } from "react-icons/fa";
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
  <div className="rounded-xl overflow-hidden bg-gray-800/50 animate-shimmer bg-[length:200%_100%]">
    <div className="aspect-[2/3] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800" />
    <div className="p-3 space-y-2">
      <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-3/4" />
      <div className="flex gap-2">
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-1/3" />
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-1/4" />
      </div>
      <div className="h-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded w-1/2" />
    </div>
  </div>
);

// Video card component - matching RecommandedMovies exactly
const VideoCard = ({ video }) => (
  <Link
    href={`/watch-movie-deatils?id=${video._id}`}
    className="group rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:shadow-xl hover:border-pink-500/30 transition-all"
  >
    <div className="relative overflow-hidden aspect-[2/3] bg-gray-900">
      <img
        src={video.thumbnailUrl || video.posterUrl || "/assets/img/placeholder-video.jpg"}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/assets/img/placeholder-video.jpg";
        }}
      />
      
      {/* Video Type Badge */}
      <span className={`absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full ${
        video.videoType === 'series' ? 'bg-purple-600' : 'bg-blue-600'
      }`}>
        {video.videoType === 'series' ? 'Series' : 'Movie'}
      </span>
      
      {/* Age Rating */}
      <span className="absolute top-2 right-2 bg-black/70 text-xs text-white px-2 py-0.5 rounded">
        {video.ageRating}
      </span>

      {/* Price Badge */}
      <span className={`absolute bottom-2 right-2 text-white text-xs px-2 py-0.5 rounded ${
        video.isFree ? 'bg-green-600' : 'bg-gradient-to-r from-yellow-600 to-orange-600'
      }`}>
        {video.isFree ? 'Free' : `₹${video.defaultPrice}`}
      </span>

      {/* Duration */}
      <span className="absolute bottom-2 left-2 bg-black/70 text-xs text-white px-2 py-0.5 rounded">
        {formatDuration(video.duration)}
      </span>

      {/* Hover Play Icon */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
          <FaPlay className="text-white text-lg" />
        </div>
      </div>
    </div>

    <div className="p-3">
      <h3 className="text-white text-sm font-medium line-clamp-2 mb-2 group-hover:text-pink-400 transition-colors">
        {video.title}
      </h3>

      {/* Channel Info */}
      {video.channelId && (
        <p className="text-xs text-gray-400 truncate mb-2">
          {video.channelId.name}
        </p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400">
        {video.languages?.[0] && (
          <span className="flex items-center gap-1">
            <FaLanguage className="text-pink-400" /> {video.languages[0]}
          </span>
        )}
        {video.averageRating > 0 && (
          <span className="flex items-center gap-1 text-yellow-400">
            <FaStar /> {video.averageRating.toFixed(1)}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
        {video.viewCount > 0 && (
          <span>{video.viewCount.toLocaleString()} views</span>
        )}
        {video.likeCount > 0 && (
          <span className="flex items-center gap-1">
            <FaThumbsUp className="text-green-400" />
            {video.likeCount}
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
        {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div> */}
        <div>
          <h2 className="text-lg font-semibold text-white">Related For You</h2>
          {/* <p className="text-xs text-gray-400">Based on your current watch</p> */}
        </div>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedVideos.slice(0, 8).map((video) => (
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
