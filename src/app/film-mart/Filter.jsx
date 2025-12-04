"use client";

import React, { useState, useMemo, useEffect } from "react";
import Button from "@/app/components/Button";
import { useGetMoviesQuery } from "../../../store/moviesApi";
import { FaTimes, FaFilter } from "react-icons/fa";

const Filter = ({ onFilterChange, initialFilters, onApply }) => {
  const [selected, setSelected] = useState({
    languages: [],
    genres: [],
    formats: [],
  });

  const { data: moviesData = [], isLoading } = useGetMoviesQuery();
  const movies = moviesData || [];

  // Sync with initial filters from parent
  useEffect(() => {
    if (initialFilters) {
      setSelected(initialFilters);
    }
  }, [initialFilters]);

  /* -----------------------------------------
     🔥 DYNAMIC FILTER VALUES FROM MOVIES API
  ------------------------------------------ */
  const languages = useMemo(() => {
    return [
      ...new Set(
        movies.flatMap((m) =>
          Array.isArray(m.languages) ? m.languages : [m.languages]
        )
      ),
    ].filter(Boolean).sort();
  }, [movies]);

  const genres = useMemo(() => {
    return [
      ...new Set(
        movies.flatMap((m) => (Array.isArray(m.genres) ? m.genres : [m.genres]))
      ),
    ].filter(Boolean).sort();
  }, [movies]);

  const formats = useMemo(() => {
    return [
      ...new Set(
        movies.flatMap((m) =>
          Array.isArray(m.formats) ? m.formats : [m.formats]
        )
      ),
    ].filter(Boolean).sort();
  }, [movies]);

  // Count total active filters
  const totalFilters = Object.values(selected).flat().length;

  /* -----------------------------------------
     🔄 MULTI SELECT HANDLER (AND SEND TO PARENT)
  ------------------------------------------ */
  const toggleSelect = (category, value) => {
    setSelected((prev) => {
      const isSelected = prev[category].includes(value);
      const newState = {
        ...prev,
        [category]: isSelected
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      };

      if (onFilterChange) {
        onFilterChange(newState);
      }
      return newState;
    });
  };

  const clearCategory = (category) => {
    const newState = { ...selected, [category]: [] };
    setSelected(newState);
    if (onFilterChange) {
      onFilterChange(newState);
    }
  };

  const clearAllFilters = () => {
    const newState = { languages: [], genres: [], formats: [] };
    setSelected(newState);
    if (onFilterChange) {
      onFilterChange(newState);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply();
    }
  };

  const renderButtons = (category, items) => {
    if (items.length === 0) {
      return <p className="text-gray-500 text-xs">No options available</p>;
    }
    
    return items.map((item, idx) => {
      const isSelected = selected[category].includes(item);
      return (
        <button
          key={idx}
          onClick={() => toggleSelect(category, item)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
            isSelected
              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent shadow-md"
              : "border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-white/5"
          }`}
        >
          {item}
        </button>
      );
    });
  };

  // Remove individual filter tag
  const removeFilter = (category, value) => {
    const newState = {
      ...selected,
      [category]: selected[category].filter((item) => item !== value),
    };
    setSelected(newState);
    if (onFilterChange) {
      onFilterChange(newState);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full lg:w-72 border border-gray-700 p-4 rounded-xl shadow-lg bg-[#13162f]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-72 border border-gray-700 p-4 rounded-xl shadow-lg bg-[#13162f]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaFilter className="text-red-500 w-4 h-4" />
          <h2 className="text-base font-semibold text-white">Filters</h2>
          {totalFilters > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {totalFilters}
            </span>
          )}
        </div>
        {totalFilters > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Applied Filters Tags */}
      {totalFilters > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Applied Filters:</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(selected).map(([category, values]) =>
              values.map((value, idx) => (
                <span
                  key={`${category}-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30"
                >
                  {value}
                  <button
                    onClick={() => removeFilter(category, value)}
                    className="hover:text-white transition-colors"
                  >
                    <FaTimes className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm text-white">Languages</span>
          {selected.languages.length > 0 && (
            <button
              onClick={() => clearCategory("languages")}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("languages", languages)}
        </div>
      </div>

      {/* Genres */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm text-white">Genres</span>
          {selected.genres.length > 0 && (
            <button
              onClick={() => clearCategory("genres")}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("genres", genres)}
        </div>
      </div>

      {/* Formats */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-sm text-white">Format</span>
          {selected.formats.length > 0 && (
            <button
              onClick={() => clearCategory("formats")}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("formats", formats)}
        </div>
      </div>

      {/* Apply Button (for mobile) */}
      {onApply && (
        <Button 
          onClick={handleApply}
          className="w-full text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
        >
          Apply Filters {totalFilters > 0 && `(${totalFilters})`}
        </Button>
      )}
    </div>
  );
};

export default Filter;
