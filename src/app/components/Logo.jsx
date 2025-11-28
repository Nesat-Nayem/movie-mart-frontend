"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useGetGeneralSettingsQuery } from "../../../store/generalSettingsApi";

const Logo = () => {
  const {
    data: generalSettings = {},
    isLoading,
    isError,
  } = useGetGeneralSettingsQuery();

  console.log(generalSettings);
  const [mounted, setMounted] = useState(false);

  // Only render on client to avoid SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Safely get the logo URL
  const logoUrl = generalSettings?.logo || "/assets/img/logo.png";

  return (
    <>
      {/* <Link href="/">
      <Image
        src={logoUrl}
        alt="Logo"
        width={55}
        height={55}
        style={{ objectFit: "contain" }}
      />
    </Link> */}

      <Link href="/">
        <Image
          src={"/assets/img/logo.png"}
          alt="Logo"
          width={55}
          height={55}
          style={{ objectFit: "contain" }}
        />
      </Link>
    </>
  );
};

export default Logo;
