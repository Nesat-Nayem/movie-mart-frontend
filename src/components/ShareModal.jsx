"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Copy, Link2 } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
  FaRedditAlien,
  FaPinterestP,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

/**
 * Modern Share Modal with Deep Linking
 * Supports: Native Web Share API, Social platforms, Copy link
 * 
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Close handler
 * @param {string} title - Content title to share
 * @param {string} description - Short description (optional)
 * @param {string} imageUrl - Image URL for rich previews (optional)
 * @param {string} url - URL to share (defaults to current page)
 * @param {string} contentType - Type of content: 'movie' | 'event' | 'video'
 */
const ShareModal = ({ 
  isOpen, 
  onClose, 
  title = "", 
  description = "", 
  imageUrl = "",
  url = "",
  contentType = "content"
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Get the share URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(url || window.location.href);
      setCanNativeShare(!!navigator.share);
    }
  }, [url, isOpen]);

  // Reset copied state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Properly encode for sharing
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || `Check out this ${contentType}: ${title}`);
  const shareText = `${title}${description ? ` - ${description}` : ""}`;
  const encodedShareText = encodeURIComponent(`${shareText}\n${shareUrl}`);
  const encodedImage = encodeURIComponent(imageUrl);

  // Content type labels
  const contentLabels = {
    movie: "Movie",
    event: "Event", 
    video: "Video",
    content: "Content"
  };

  // Social share links with proper deep linking
  const shareLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#166FE5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-[#1DA1F2]",
      hoverColor: "hover:bg-[#1A91DA]",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#20BD5A]",
      url: `https://api.whatsapp.com/send?text=${encodedShareText}`,
    },
    {
      name: "Telegram",
      icon: FaTelegramPlane,
      color: "bg-[#0088CC]",
      hoverColor: "hover:bg-[#007AB8]",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      color: "bg-[#0A66C2]",
      hoverColor: "hover:bg-[#095196]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Reddit",
      icon: FaRedditAlien,
      color: "bg-[#FF4500]",
      hoverColor: "hover:bg-[#E53E00]",
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Pinterest",
      icon: FaPinterestP,
      color: "bg-[#E60023]",
      hoverColor: "hover:bg-[#CC001F]",
      url: imageUrl 
        ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`
        : `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    },
    {
      name: "Email",
      icon: HiMail,
      color: "bg-[#EA4335]",
      hoverColor: "hover:bg-[#D33426]",
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    },
  ];

  // Copy link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Native share (mobile devices)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || `Check out this ${contentType}: ${title}`,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  // Handle social link click
  const handleSocialClick = (link, e) => {
    e.preventDefault();
    // Open in a centered popup for better UX
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      link.url,
      `share-${link.name}`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-gradient-to-br from-[#0B1730] to-[#0a0f1e] border border-white/10 p-6 rounded-2xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">
            Share this {contentLabels[contentType]}
          </h2>
          <p className="text-sm text-gray-400 line-clamp-1">{title}</p>
        </div>

        {/* Native Share Button (Mobile) */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="w-full mb-4 py-3 px-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
          >
            <Link2 size={18} />
            Share via Device
          </button>
        )}

        {/* Social Share Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              onClick={(e) => handleSocialClick(link, e)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} ${link.hoverColor} p-3 rounded-xl flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 group`}
              title={`Share on ${link.name}`}
            >
              <link.icon className="text-lg" />
            </a>
          ))}
        </div>

        {/* Copy Link Section */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Or copy link</p>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-300 px-2 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Share with friends and family
        </p>
      </div>
    </div>
  );
};

export default ShareModal;
