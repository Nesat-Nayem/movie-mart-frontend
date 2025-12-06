"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useGetGeneralSettingsQuery } from "../../../store/generalSettingsApi";

const Logo = ({ width = 55, height = 55 }) => {
  const {
    data: generalSettings = {},
    isLoading,
  } = useGetGeneralSettingsQuery();

  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safely get the logo URL - use dynamic logo from settings or fallback
  const logoUrl = generalSettings?.logo || "/assets/img/logo.png";

  // Show skeleton while loading or not mounted
  if (!mounted || isLoading) {
    return (
      <div 
        className="animate-pulse bg-gray-700 rounded-full"
        style={{ width, height }}
      />
    );
  }

  return (
    <Link href="/">
      <Image
        src={logoUrl}
        alt="Logo"
        width={width}
        height={height}
        style={{ objectFit: "contain" }}
        unoptimized={logoUrl.includes("cloudinary") || logoUrl.includes("http")}
      />
    </Link>
  );
};

export default Logo;
