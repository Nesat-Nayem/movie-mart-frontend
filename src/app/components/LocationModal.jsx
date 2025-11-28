"use client";

import React, { useEffect, useState } from "react";

const LocationModal = () => {
  const [locationText, setLocationText] = useState("");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await res.json();
          const text = data?.display_name || "Unable to detect exact location.";
          setLocationText(text);
        } catch (err) {
          console.error(err);
          setLocationText("Error fetching location.");
        }
      },
      () => {
        setLocationText("Permission denied or unable to detect location.");
      }
    );
  }, []);

  // 🔥 FIX: render nothing until client-side hydration completes
  if (!mounted) return <div className="text-xs">Detecting location...</div>;

  return (
    <div className="text-xs flex items-center gap-1">
      <img
        src="/assets/img/location.png"
        alt="loc"
        style={{ width: 16, height: 16 }}
      />
      {locationText ? locationText.slice(0, 30) : "Detecting location"}...
    </div>
  );
};

export default LocationModal;
