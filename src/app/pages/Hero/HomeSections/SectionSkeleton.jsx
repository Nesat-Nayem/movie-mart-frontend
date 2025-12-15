"use client";

import React from "react";

// Modern skeleton card with shimmer effect
const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
    <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%]" />
    <div className="p-3 space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-3/4" />
      <div className="flex justify-between">
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
        <div className="h-3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/4" />
      </div>
      <div className="h-6 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full w-1/3" />
    </div>
  </div>
);

// Section skeleton with title
const SectionSkeleton = ({ title }) => (
  <section className="py-5">
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-4">
        {title ? (
          <h2 className="text-xl md:text-3xl font-bold gradient-text">{title}</h2>
        ) : (
          <div className="h-8 w-48 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        )}
        <div className="h-10 w-28 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    </div>
  </section>
);

export { SkeletonCard, SectionSkeleton };
export default SectionSkeleton;
