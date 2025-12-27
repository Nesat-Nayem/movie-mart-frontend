"use client";

import React from "react";
import Link from "next/link";
import { FaLanguage, FaThumbsUp, FaStar, FaPlay } from "react-icons/fa";
import { useGetRecommendedVideosQuery } from "../../../store/watchVideosApi";

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

// Episode card for series
const EpisodeCard = ({ episode, seasonNumber, videoId, isCurrentEpisode }) => (
  <Link
    href={`/watch-movie-deatils?id=${videoId}&season=${seasonNumber}&episode=${episode.episodeNumber}`}
    className={`group rounded-xl overflow-hidden border transition-all ${
      isCurrentEpisode 
        ? 'bg-pink-500/20 border-pink-500' 
        : 'bg-white/5 border-white/10 hover:border-pink-500/30'
    }`}
  >
    <div className="relative">
      <img
        src={episode.thumbnailUrl || "/assets/img/placeholder-video.jpg"}
        alt={episode.title}
        className="w-full h-32 sm:h-36 object-cover transition-transform group-hover:scale-105"
      />
      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
        S{seasonNumber} E{episode.episodeNumber}
      </span>
      <span className="absolute bottom-2 left-2 bg-black/70 text-xs text-white px-2 py-0.5 rounded">
        {formatDuration(episode.duration)}
      </span>
      {!isCurrentEpisode && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <FaPlay className="text-white text-sm" />
          </div>
        </div>
      )}
      {isCurrentEpisode && (
        <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
          <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">Now Playing</span>
        </div>
      )}
    </div>
    <div className="p-2">
      <h4 className="text-white text-sm font-medium line-clamp-1 group-hover:text-pink-400 transition-colors">
        {episode.title}
      </h4>
    </div>
  </Link>
);

const RecommandedMovies = ({ currentVideoId, currentVideo, currentSeason, currentEpisode }) => {
  // Check if current video is a series with episodes
  const isSeries = currentVideo?.videoType === 'series' && currentVideo?.seasons?.length > 0;
  
  // Fetch recommended videos (used for single videos or as fallback)
  const { data: videos = [], isLoading } = useGetRecommendedVideosQuery({
    videoId: currentVideoId,
    limit: 8
  }, {
    skip: isSeries // Skip if it's a series, we'll show episodes instead
  });

  if (isLoading) {
    return (
      <div className="px-4 mt-6 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <VideoSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  // For series: show episodes
  if (isSeries) {
    return (
      <div className="px-4 mt-8 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Episodes - {currentVideo.title}
          </h2>
        </div>

        {currentVideo.seasons.map((season) => (
          <div key={season.seasonNumber} className="mb-6">
            <h3 className="text-md font-medium text-gray-300 mb-3">
              Season {season.seasonNumber}: {season.title || ''}
              <span className="text-gray-500 text-sm ml-2">({season.episodes?.length || 0} episodes)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {season.episodes?.map((episode) => (
                <EpisodeCard
                  key={`${season.seasonNumber}-${episode.episodeNumber}`}
                  episode={episode}
                  seasonNumber={season.seasonNumber}
                  videoId={currentVideoId}
                  isCurrentEpisode={
                    currentSeason === season.seasonNumber && 
                    currentEpisode === episode.episodeNumber
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // For single videos: show recommended
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="px-4 mt-8 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recommended for You</h2>
        <Link
          href="/watch-movies"
          className="text-sm text-pink-400 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {videos.map((video) => (
          <Link
            key={video._id}
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
        ))}
      </div>
    </div>
  );
};

export default RecommandedMovies;
