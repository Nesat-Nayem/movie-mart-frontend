"use client";

import { useState, useEffect } from "react";

/**
 * AdWrapper Component
 * Provides a clean container for ads with loading state and error handling
 * Ensures ads don't break the UI layout
 */
const AdWrapper = ({ 
  children, 
  className = "", 
  label = "Advertisement",
  showLabel = true,
  minHeight = "90px",
  background = "transparent"
}) => {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server
  if (!isClient) {
    return (
      <div 
        className={`w-full ${className}`}
        style={{ minHeight }}
      />
    );
  }

  if (hasError) {
    return null; // Hide broken ad space
  }

  return (
    <div 
      className={`ad-wrapper relative ${className}`}
      style={{ 
        minHeight,
        background,
        overflow: "hidden"
      }}
    >
      {showLabel && (
        <div className="text-center mb-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}
      <div 
        className="ad-content"
        onError={() => setHasError(true)}
      >
        {children}
      </div>
    </div>
  );
};

export default AdWrapper;
