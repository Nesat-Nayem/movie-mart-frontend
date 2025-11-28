"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const ProfileDrawer = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // helper to close drawer on link click
  const handleLinkClick = (href) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Trigger */}
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <FaUserCircle className="text-2xl" />
        <span className="hidden sm:inline text-sm">Hi, Guest</span>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#13162f] shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Hey!</h2>
          <button
            onClick={() => setOpen(false)}
            className="ml-2 sm:ml-3 text-2xl text-gray-300 hover:text-white cursor-pointer bg-red-500 rounded-full p-1"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-sm">
          <ul className="space-y-3">
            {[
              { href: "/notification", label: "🔔 Notifications", badge: "4" },
              { href: "/my-bookmark", label: "📦 My Bookmark" },
              { href: "/my-booking-tickets", label: "🎬 My Booking Tickets" },
              { href: "/help", label: "❓ Help & Support" },
              { href: "/privacy", label: "🔒 Privacy policy" },
              { href: "/terms", label: "📜 Terms & Conditions" },
              { href: "/vendor-policy", label: "📜 Vendor Policy" },
              { href: "/profile-settings", label: "⚙️ Accounts & Settings" },
              {
                href: "/become-vendor",
                label: "🚀 Become A Vendor",
                highlight: true,
              },
            ].map((item) => (
              <li
                key={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`flex items-center justify-between cursor-pointer px-2 py-2 rounded-md ${
                  item.highlight
                    ? "bg-gray-700 hover:bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t">
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileDrawer;