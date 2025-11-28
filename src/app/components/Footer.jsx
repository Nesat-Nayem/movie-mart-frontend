"use client";

import React, { useEffect, useState } from "react";
import Logo from "@/app/components/Logo";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa6";
import { useGetGeneralSettingsQuery } from "../../../store/generalSettingsApi";

const Footer = () => {
  const {
    data: generalSettings = {},
    isLoading,
    isError,
  } = useGetGeneralSettingsQuery();
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Fallback URLs to prevent broken links
  const socialLinks = {
    facebook: generalSettings.facebook || "#",
    twitter: generalSettings.twitter || "#",
    instagram: generalSettings.instagram || "#",
    youtube: generalSettings.youtube || "#",
    linkedin: generalSettings.linkedin || "#",
  };

  return (
    <footer className="text-gray-400 text-center py-8">
      {/* Top Logo */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <hr className="flex-grow border-gray-600" />
        <Logo />
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mb-6">
        <a
          href={socialLinks.facebook}
          className="text-gray-400 hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href={socialLinks.instagram}
          className="text-gray-400 hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href={socialLinks.linkedin}
          className="text-gray-400 hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn size={20} />
        </a>
        <a
          href={socialLinks.twitter}
          className="text-gray-400 hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter size={20} />
        </a>

        <a
          href={socialLinks.youtube}
          className="text-gray-400 hover:text-white transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube size={20} />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-sm max-w-4xl mx-auto leading-relaxed px-4">
        Copyright 2025 © Moviemart All Rights Reserved. <br />
        The content and images used on this site are copyright protected and
        copyrights vests with the respective owners. The usage of the content
        and images on this website is intended to promote the works and no
        endorsement of the artist shall be implied. Unauthorized use is
        prohibited and punishable by law.
      </p>
    </footer>
  );
};

export default Footer;
