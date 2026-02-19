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
    if (!navigator.geolocation) {
      setLocationText("Location not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );

          if (!res.ok) throw new Error("Nominatim error");

          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state ||
            data?.display_name;
          setLocationText(city || "Unknown location");
        } catch {
          setLocationText("Location unavailable");
        }
      },
      () => {
        setLocationText("Location access denied");
      },
      { timeout: 8000 }
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
