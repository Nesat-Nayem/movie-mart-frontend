"use client";
import React, { useState } from "react";
import {
  FaBell,
  FaInfoCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaTicketAlt,
  FaCalendarAlt,
  FaEdit,
  FaChevronRight,
  FaGoogle,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import toast from "react-hot-toast";

const ProfileSettings = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  // Get auth provider icon
  const getAuthProviderIcon = () => {
    if (user?.authProvider === "google") return <FaGoogle className="text-red-400" />;
    if (user?.authProvider === "phone") return <FaPhone className="text-green-400" />;
    return <FaEnvelope className="text-blue-400" />;
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    if (user?.phone) return `+91 ${user.phone}`;
    return "User";
  };

  // Get user identifier (email or phone)
  const getUserIdentifier = () => {
    if (user?.email) return user.email;
    if (user?.phone) return `+91 ${user.phone}`;
    return "";
  };

  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744]">
        <div className="max-w-xl mx-auto py-6 px-4">
          {/* Profile Card */}
          <div className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-md border border-pink-500/30 rounded-3xl p-6 mb-6">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0B1730] flex items-center justify-center overflow-hidden">
                    {user?.img ? (
                      <Image
                        src={user.img}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaUser className="text-3xl text-gray-400" />
                    )}
                  </div>
                </div>
                {/* Auth Provider Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1a2744] border-2 border-pink-500/50 flex items-center justify-center">
                  {getAuthProviderIcon()}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">{getDisplayName()}</h1>
                <p className="text-gray-400 text-sm">{getUserIdentifier()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {user?.role || "user"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {user?.authProvider || "local"}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <Link href="/profile-settings/editProfile">
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <FaEdit className="text-pink-400" />
                </button>
              </Link>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/5 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden">
            {/* My Bookings Section */}
            <div className="p-5 border-b border-gray-700/50">
              <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaTicketAlt className="text-pink-400" />
                My Bookings
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/profile-settings/movie-ticket">
                  <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 rounded-2xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                    <div className="text-3xl mb-2">🎬</div>
                    <p className="text-white font-medium text-sm">Movie Tickets</p>
                    <p className="text-gray-500 text-xs">View bookings</p>
                  </div>
                </Link>
                <Link href="/profile-settings/event-ticket">
                  <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-3xl mb-2">🎸</div>
                    <p className="text-white font-medium text-sm">Event Tickets</p>
                    <p className="text-gray-500 text-xs">View bookings</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 border-b border-gray-700/50">
              <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaHistory className="text-pink-400" />
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link href="/movie-list">
                  <MenuItem icon="🔔" title="Movie Reminders" subtitle="Set reminders for upcoming movies" />
                </Link>
                <Link href="/notification">
                  <MenuItem 
                    icon={<FaBell className="text-yellow-400" />} 
                    title="Notifications" 
                    subtitle="View your notifications"
                    badge={4}
                  />
                </Link>
              </div>
            </div>

            {/* Support Section */}
            <div className="p-5 border-b border-gray-700/50">
              <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaCog className="text-pink-400" />
                Support & Info
              </h2>
              <div className="space-y-2">
                <Link href="/faq">
                  <MenuItem 
                    icon={<FaQuestionCircle className="text-blue-400" />} 
                    title="FAQs" 
                    subtitle="Frequently asked questions" 
                  />
                </Link>
                <Link href="/about">
                  <MenuItem 
                    icon={<FaInfoCircle className="text-green-400" />} 
                    title="About Us" 
                    subtitle="Learn more about Moviemart" 
                  />
                </Link>
              </div>
            </div>

            {/* Logout Section */}
            <div className="p-5">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full bg-gradient-to-r from-red-500/20 to-red-600/10 hover:from-red-500/30 hover:to-red-600/20 border border-red-500/30 hover:border-red-500/50 rounded-2xl p-4 flex items-center justify-between transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <FaSignOutAlt className="text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-red-400 font-semibold">
                      {loggingOut ? "Logging out..." : "Logout"}
                    </p>
                    <p className="text-gray-500 text-xs">Sign out from your account</p>
                  </div>
                </div>
                <FaChevronRight className="text-red-400/50" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-600 text-xs mt-8 py-4">
            <p>Moviemart © 2024</p>
            <p className="mt-1">All Rights Reserved</p>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

// Reusable Menu Item Component
const MenuItem = ({ icon, title, subtitle, badge }) => (
  <div className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
        {typeof icon === "string" ? icon : icon}
      </div>
      <div>
        <p className="text-white font-medium text-sm flex items-center gap-2">
          {title}
          {badge && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
              {badge}
            </span>
          )}
        </p>
        <p className="text-gray-500 text-xs">{subtitle}</p>
      </div>
    </div>
    <FaChevronRight className="text-gray-600 group-hover:text-gray-400 transition-colors" />
  </div>
);

export default ProfileSettings;
