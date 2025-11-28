"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookmarkMinus } from "lucide-react";

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);

  // Load on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(saved);
  }, []);

  const removeBookmark = (id) => {
    const updated = bookmarks.filter((item) => item._id !== id);
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  return (
    <section className="min-h-screen bg-[#0B1730] text-white py-4 px-4">
      <div className="max-w-md mx-auto shadow-2xl border border-gray-700 rounded-2xl p-3 bg-white/10 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-lg font-semibold">My Bookmark List</h1>
          <span className="text-sm text-gray-400">({bookmarks.length})</span>
        </div>

        {/* Bookmark List */}
        {bookmarks.length === 0 ? (
          <p className="text-center text-gray-400">No bookmarks yet.</p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-gray-800 p-3 rounded-xl hover:bg-white/20 transition"
              >
                <Link href={item.link} className="flex-shrink-0">
                  <Image
                    src={
                      item.poster && item.poster.trim() !== ""
                        ? item.poster
                        : "/no-image.png"
                    }
                    alt={item.title}
                    width={60}
                    height={90}
                    className="rounded-lg object-cover w-16 h-20"
                  />
                </Link>

                {/* Title */}
                <div className="flex-1">
                  <Link href={item.link}>
                    <h2 className="font-medium text-sm sm:text-base line-clamp-2">
                      {item.title}
                    </h2>
                  </Link>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeBookmark(item._id)}
                  className="p-2 rounded-full hover:bg-white/20 transition"
                >
                  <BookmarkMinus className="w-5 h-5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Bookmark;
