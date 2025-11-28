"use client";

import React, { useState } from "react";
import Button from "@/app/components/Button";

const Filter = () => {
  const [selected, setSelected] = useState({
    date: [],
    languages: [],
    categories: [],
    more: [],
    price: [],
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

  // Fields (from your screenshot)
  const dates = ["Today", "Tomorrow", "This Weekend", "Date Range"];
  const languages = [
    "Hindi",
    "English",
    "Telugu",
    "Bengali",
    "Kannada",
    "Tamil",
    "Malayalam",
    "Punjabi",
    "Urdu",
    "Marathi",
    "Gujarati",
    "Hinglish",
    "Haryanavi",
    "Korean",
    "Odia",
    "Bhojpuri",
    "Japanese",
    "Dogri",
    "Sanskrit",
    "Assamese",
    "Sindhi",
    "Unspecified",
  ];
  const categories = [
    "Workshops",
    "Comedy Shows",
    "Performances",
    "Music Shows",
    "Kids",
    "Marquee",
    "Exhibitions",
    "Screening",
    "Conferences",
    "Spirituality",
    "Talks",
  ];
  const moreFilters = [
    "Outdoor Events",
    "Parties",
    "Must Attend",
    "LuvLocal Events",
    "Kids Allowed",
    "Kids Activities",
    "Meetups",
    "New Year Parties",
    "Online Streaming",
  ];
  const price = ["Free", "0–500", "501–1000", "Above 1000"];

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
    <div className="w-100 sm:w-100 md:w-100 lg:w-72 border border-gray-300 p-4 rounded-lg shadow-md bg-[#13162f]">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Date */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium ">Date</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, date: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("date", dates)}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span className="font-medium ">Languages</span>
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

      {/* Categories */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium ">Categories</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, categories: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("categories", categories)}
        </div>
      </div>

      {/* More Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium ">More Filters</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, more: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("more", moreFilters)}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium ">Price</span>
          <button
            onClick={() => setSelected((prev) => ({ ...prev, price: [] }))}
            className="text-sm text-red-500 hover:underline cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {renderButtons("price", price)}
        </div>
      </div>

      {/* Browse Button */}
      <Button className="w-full mt-4">Browse by Venues</Button>
    </div>
  );
};

export default Filter;
