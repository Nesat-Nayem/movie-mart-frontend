"use client";

import React, { useState, useMemo } from "react";
import Button from "@/app/components/Button";
import { useGetMoviesQuery } from "../../../store/moviesApi";

const Filter = ({ onFilterChange }) => {
  const [selected, setSelected] = useState({
    languages: [],
    genres: [],
    formats: [],
  });

  const { data: moviesData = [] } = useGetMoviesQuery();
  const movies = moviesData || [];

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
    ].filter(Boolean);
  }, [movies]);

  const genres = useMemo(() => {
    return [
      ...new Set(
        movies.flatMap((m) => (Array.isArray(m.genres) ? m.genres : [m.genres]))
      ),
    ].filter(Boolean);
  }, [movies]);

  const formats = useMemo(() => {
    return [
      ...new Set(
        movies.flatMap((m) =>
          Array.isArray(m.formats) ? m.formats : [m.formats]
        )
      ),
    ].filter(Boolean);
  }, [movies]);

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

      onFilterChange(newState); // 🔥 send to MoviesSection
      return newState;
    });
  };

  const clearCategory = (category) => {
    const newState = { ...selected, [category]: [] };
    setSelected(newState);
    onFilterChange(newState);
  };

  const renderButtons = (category, items) =>
    items.map((item, idx) => {
      const isSelected = selected[category].includes(item);
      return (
        <button
          key={idx}
          onClick={() => toggleSelect(category, item)}
          className={`px-2 py-0.5 rounded text-xs border transition cursor-pointer ${
            isSelected
              ? "bg-red-500 text-white border-red-500"
              : "border-red-300 text-red-500 hover:bg-red-100"
          }`}
        >
          {item}
        </button>
      );
    });

  return (
    <div className="w-full lg:w-72 border border-gray-300 p-4 rounded-lg shadow-md bg-[#13162f]">
      <h2 className="text-base font-semibold mb-3 text-white">Filters</h2>

      {/* Languages */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-white">Languages</span>
          <button
            onClick={() => clearCategory("languages")}
            className="text-xs text-red-400 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {renderButtons("languages", languages)}
        </div>
      </div>

      {/* Genres */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-white">Genres</span>
          <button
            onClick={() => clearCategory("genres")}
            className="text-xs text-red-400 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {renderButtons("genres", genres)}
        </div>
      </div>

      {/* Formats */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-sm text-white">Format</span>
          <button
            onClick={() => clearCategory("formats")}
            className="text-xs text-red-400 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {renderButtons("formats", formats)}
        </div>
      </div>

      <Button className="w-full text-sm">Browse Movies</Button>
    </div>
  );
};

export default Filter;
