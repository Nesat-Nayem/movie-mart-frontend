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

  // Social links configuration - only show if URL is set
  const socialLinks = [
    { key: 'facebook', url: generalSettings.facebook, icon: FaFacebookF },
    { key: 'instagram', url: generalSettings.instagram, icon: FaInstagram },
    { key: 'linkedin', url: generalSettings.linkedin, icon: FaLinkedinIn },
    { key: 'twitter', url: generalSettings.twitter, icon: FaXTwitter },
    { key: 'youtube', url: generalSettings.youtube, icon: FaYoutube },
  ].filter(link => link.url && link.url.trim() !== '');

  return (
    <footer className="text-gray-400 text-center py-8">
      {/* Top Logo */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <hr className="flex-grow border-gray-600" />
        <Logo />
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* Social Icons - Only show if there are valid links */}
      {socialLinks.length > 0 && (
        <div className="flex justify-center gap-6 mb-6">
          {socialLinks.map(({ key, url, icon: Icon }) => (
            <a
              key={key}
              href={url}
              className="text-gray-400 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      )}

      {/* Copyright */}
      <p className="text-sm max-w-4xl mx-auto leading-relaxed px-4">
        All Rights Reserved & Copiright MovieMart @ ARIGC TECH PVT LTD <br />
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
