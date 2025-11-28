import React from "react";
import {
  FaCreditCard,
  FaPalette,
  FaBell,
  FaUser,
  FaInfoCircle,
  FaSignOutAlt,
  FaQuestionCircle,
  FaComments,
  FaRegCommentDots,
} from "react-icons/fa";
import ProfileEditModal from "./ProfileEidtModal";
import Link from "next/link";

const ProfileSettings = () => {
  return (
    <section className="min-h-screen bg-[#0B1730]">
      <div className="max-w-xl mx-auto py-4 px-4">
        <div className="min-h-screen bg-white/10 backdrop-blur-md border border-gray-700 rounded-2xl text-white px-4 py-6">
          {/* Profile Info */}
          <ProfileEditModal />

          {/* All Bookings */}
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm mb-3">All bookings</h2>
            <div className="grid grid-cols-3 gap-3">
              <Link href="/profile-settings/movie-ticket">
                <div className="bg-gray-800 rounded-lg p-3 text-center text-sm">
                  🎬 <p>Movie tickets</p>
                </div>
              </Link>

              <Link href="/profile-settings/event-ticket">
                <div className="bg-gray-800 rounded-lg p-3 text-center text-sm">
                  🎸 <p>Event tickets</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Manage */}
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm mb-2">Manage</h2>
            <div className="space-y-2">
              <Link href="/movie-list">
                <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <span>🔔 Movie reminders</span>
                  <span>›</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm mb-2">Support</h2>
            <div className="space-y-2">
              <Link href="/faq">
                <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaQuestionCircle /> Frequently asked questions
                  </span>
                  <span>›</span>
                </div>
              </Link>
            </div>
          </div>

          {/* More */}
          <div className="mb-6">
            <h2 className="text-gray-400 text-sm mb-2">More</h2>
            <div className="flex flex-col gap-2">
              <Link href="/notification">
                <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaBell /> Notification{" "}
                    <span className="text-xs badge bg-red-500 px-2 py-1 rounded-2xl font-bold">
                      4
                    </span>
                  </span>
                  <span>›</span>
                </div>
              </Link>

              <Link href="/about">
                <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <FaInfoCircle /> About us
                  </span>
                  <span>›</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Logout */}
          <Link href="/login">
            <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center text-red-500 font-semibold">
              <span className="flex items-center gap-2">
                <FaSignOutAlt /> Logout
              </span>
              <span>›</span>
            </div>
          </Link>

          {/* Footer */}
          <div className="text-center text-gray-500 text-xs mt-6">
            Moviemart All Rights Reserved
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSettings;
