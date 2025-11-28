import React, { useState } from "react";
import { Bookmark, Share2, X } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";

const Actions = () => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 self-start">
      {/* Bookmark Button */}
      <button
        onClick={() => setBookmarked(!bookmarked)}
        className={`flex cursor-pointer items-center gap-1 px-3 py-2 rounded-lg text-sm transition 
          ${
            bookmarked
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-white/10 hover:bg-white/20"
          }`}
      >
        <Bookmark size={16} />
        {bookmarked ? "Saved" : "Watchlist"}
      </button>

      {/* Share Button */}
      <button
        onClick={() => setShareOpen(true)}
        className="p-2 cursor-pointer bg-white/10 rounded-lg hover:bg-white/20"
      >
        <Share2 size={16} />
      </button>

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0B1730] p-6 rounded-xl w-80 relative">
            <button
              onClick={() => setShareOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-white mb-4">
              Share this movie
            </h2>
            <div className="flex justify-between text-white text-xl">
              <a
                href="https://facebook.com"
                target="_blank"
                className="p-3 bg-blue-600 rounded-full hover:opacity-80"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                className="p-3 bg-sky-500 rounded-full hover:opacity-80"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                className="p-3 bg-blue-700 rounded-full hover:opacity-80"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                className="p-3 bg-green-500 rounded-full hover:opacity-80"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                className="p-3 bg-pink-500 rounded-full hover:opacity-80"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Actions;
