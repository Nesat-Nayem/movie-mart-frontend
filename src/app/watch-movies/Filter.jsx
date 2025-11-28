"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";
const Filter = () => {
  const [selected, setSelected] = useState({
    languages: [],
    genres: [],
    formats: [],
  });

  const toggleSelect = (category, value) => {
    setSelected((prev) => {
      const isSelected = prev[category].includes(value);
      return {
        ...prev,
        [category]: isSelected
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      };
    });
  };

  const languages = [
    "English",
    "Hindi",
    "Japanese",
    "English 7D",
    "Malayalam",
    "Marathi",
    "Telugu",
    "Garhwali",
    "Manipuri",
    "Tamil",
  ];

  const genres = [
    "Drama",
    "Adventure",
    "Action",
    "Comedy",
    "Thriller",
    "Romantic",
    "Fantasy",
    "Sci-Fi",
    "Family",
    "Horror",
    "Sports",
    "Animation",
    "Biography",
    "Crime",
    "Musical",
    "Mystery",
    "Psychological",
    "Anime",
    "Classic",
    "Documentary",
    "Historical",
    "Period",
    "Supernatural",
  ];

  const formats = ["2D", "3D", "4DX", "7D", "ICE", "IMAX 2D", "2D SCREEN X"];

  const renderButtons = (category, items) =>
    items.map((item, idx) => {
      const isSelected = selected[category].includes(item);
      return (
        <button
          key={idx}
          onClick={() => toggleSelect(category, item)}
          className={`px-3 py-1 rounded text-sm border transition cursor-pointer ${
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
    <div className="w-72 border border-gray-500 p-4 rounded-lg shadow-md bg-[#13162f]">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Languages */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-white">Languages</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, languages: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("languages", languages)}
        </div>
      </div>

      {/* Genres */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-white">Genres</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, genres: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("genres", genres)}
        </div>
      </div>

      {/* Format */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-white">Format</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, formats: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("formats", formats)}
        </div>
      </div>

      {/* Browse Button */}
      <Button onClick={() => router.push("/login")}>Browse Movies</Button>
    </div>
  );
};

export default Filter;
