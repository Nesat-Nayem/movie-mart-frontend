"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FaTimes, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useGetWatchVideosQuery, useGetWatchCategoriesQuery } from "../../../store/watchVideosApi";

const WatchVideosFilter = ({ filters, onFilterChange, onApply }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    languages: true,
    genres: true,
    videoType: true,
    pricing: true,
  });

  // Fetch videos to extract unique filter values
  const { data: videosData, isLoading: videosLoading } = useGetWatchVideosQuery({ 
    limit: 100, 
    status: 'published' 
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useGetWatchCategoriesQuery();

  const videos = videosData?.videos || [];
  const categories = categoriesData || [];

  // Extract unique values from videos
  const uniqueLanguages = useMemo(() => {
    const langs = new Set();
    videos.forEach(v => {
      if (Array.isArray(v.languages)) {
        v.languages.forEach(l => langs.add(l));
      }
    });
    return Array.from(langs).sort();
  }, [videos]);

  const uniqueGenres = useMemo(() => {
    const genreSet = new Set();
    videos.forEach(v => {
      if (Array.isArray(v.genres)) {
        v.genres.forEach(g => genreSet.add(g));
      }
    });
    return Array.from(genreSet).sort();
  }, [videos]);

  const uniqueCategories = useMemo(() => {
    const catSet = new Set();
    videos.forEach(v => {
      if (v.category) catSet.add(v.category);
    });
    // Also add categories from API
    categories.forEach(c => {
      if (c.name) catSet.add(c.name);
    });
    return Array.from(catSet).sort();
  }, [videos, categories]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      genre: '',
      language: '',
      videoType: '',
      isFree: '',
    });
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  const isLoading = videosLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="w-full lg:w-72 border border-gray-700 p-4 rounded-xl shadow-lg bg-[#13162f]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-72 border border-gray-700 p-4 rounded-xl shadow-lg bg-[#13162f] sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-pink-500 w-4 h-4" />
          <h2 className="text-base font-semibold text-white">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFilterCount > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-1.5">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full border border-pink-500/30">
                {filters.category}
                <button onClick={() => handleFilterChange('category', '')} className="hover:text-white">
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filters.genre && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                {filters.genre}
                <button onClick={() => handleFilterChange('genre', '')} className="hover:text-white">
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filters.language && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                {filters.language}
                <button onClick={() => handleFilterChange('language', '')} className="hover:text-white">
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filters.videoType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                {filters.videoType === 'single' ? 'Movies' : 'Series'}
                <button onClick={() => handleFilterChange('videoType', '')} className="hover:text-white">
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filters.isFree === 'true' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                Free Only
                <button onClick={() => handleFilterChange('isFree', '')} className="hover:text-white">
                  <FaTimes className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Video Type */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('videoType')}
          className="flex justify-between items-center w-full mb-2"
        >
          <span className="font-medium text-sm text-white">Video Type</span>
          {expandedSections.videoType ? <FaChevronUp className="text-gray-400 w-3 h-3" /> : <FaChevronDown className="text-gray-400 w-3 h-3" />}
        </button>
        {expandedSections.videoType && (
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: '' },
              { label: '🎬 Movies', value: 'single' },
              { label: '📺 Series', value: 'series' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => handleFilterChange('videoType', type.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  filters.videoType === type.value
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent shadow-md"
                    : "border-gray-600 text-gray-300 hover:border-pink-400 hover:text-pink-400 bg-white/5"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <button 
          onClick={() => toggleSection('pricing')}
          className="flex justify-between items-center w-full mb-2"
        >
          <span className="font-medium text-sm text-white">Pricing</span>
          {expandedSections.pricing ? <FaChevronUp className="text-gray-400 w-3 h-3" /> : <FaChevronDown className="text-gray-400 w-3 h-3" />}
        </button>
        {expandedSections.pricing && (
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: '' },
              { label: '✓ Free', value: 'true' },
              { label: '💎 Premium', value: 'false' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('isFree', option.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  filters.isFree === option.value
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent shadow-md"
                    : "border-gray-600 text-gray-300 hover:border-green-400 hover:text-green-400 bg-white/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      {uniqueCategories.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('categories')}
            className="flex justify-between items-center w-full mb-2"
          >
            <span className="font-medium text-sm text-white">Categories</span>
            {expandedSections.categories ? <FaChevronUp className="text-gray-400 w-3 h-3" /> : <FaChevronDown className="text-gray-400 w-3 h-3" />}
          </button>
          {expandedSections.categories && (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {uniqueCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    filters.category === cat
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white border-transparent shadow-md"
                      : "border-gray-600 text-gray-300 hover:border-pink-400 hover:text-pink-400 bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Languages */}
      {uniqueLanguages.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('languages')}
            className="flex justify-between items-center w-full mb-2"
          >
            <span className="font-medium text-sm text-white">Languages</span>
            {expandedSections.languages ? <FaChevronUp className="text-gray-400 w-3 h-3" /> : <FaChevronDown className="text-gray-400 w-3 h-3" />}
          </button>
          {expandedSections.languages && (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {uniqueLanguages.map((lang, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFilterChange('language', filters.language === lang ? '' : lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    filters.language === lang
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-transparent shadow-md"
                      : "border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-white/5"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Genres */}
      {uniqueGenres.length > 0 && (
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('genres')}
            className="flex justify-between items-center w-full mb-2"
          >
            <span className="font-medium text-sm text-white">Genres</span>
            {expandedSections.genres ? <FaChevronUp className="text-gray-400 w-3 h-3" /> : <FaChevronDown className="text-gray-400 w-3 h-3" />}
          </button>
          {expandedSections.genres && (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {uniqueGenres.map((genre, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFilterChange('genre', filters.genre === genre ? '' : genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    filters.genre === genre
                      ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white border-transparent shadow-md"
                      : "border-gray-600 text-gray-300 hover:border-purple-400 hover:text-purple-400 bg-white/5"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply Button (for mobile drawer) */}
      {onApply && (
        <button 
          onClick={onApply}
          className="w-full mt-4 py-2.5 text-sm font-medium bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white rounded-lg transition-all shadow-lg"
        >
          Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.7);
        }
      `}</style>
    </div>
  );
};

export default WatchVideosFilter;
