"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";
import toast from "react-hot-toast";

const ProfileEditPage = () => {
  const router = useRouter();
  const { user, updateUser, token } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
      if (user.img) setPhoto(user.img);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // For now, just update local state
    // TODO: Add API call to update user profile
    try {
      const updatedUser = { ...user, ...formData };
      updateUser(updatedUser);
      toast.success("Profile updated successfully");
      router.push("/profile-settings");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744] py-6">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white/5 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-gray-700/50">
              <button
                onClick={() => router.push("/profile-settings")}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FaArrowLeft className="text-white" />
              </button>
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center py-8 border-b border-gray-700/50">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-1">
                  <div className="w-full h-full rounded-full bg-[#0B1730] flex items-center justify-center overflow-hidden">
                    {photo ? (
                      photo.startsWith("http") ? (
                        <Image
                          src={photo}
                          alt="Profile"
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <FaUser className="text-4xl text-gray-400" />
                    )}
                  </div>
                </div>

                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                >
                  <FaCamera size={16} className="text-white" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <p className="text-gray-400 text-sm mt-3">Tap to change photo</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-700 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Phone Number
                  {user?.authProvider === "phone" && (
                    <span className="text-xs text-green-400 ml-2">(Primary)</span>
                  )}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone ? `+91 ${formData.phone}` : "Not provided"}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-700 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email Address
                  {user?.authProvider === "google" && (
                    <span className="text-xs text-red-400 ml-2">(Google)</span>
                  )}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={user?.authProvider === "google"}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors ${
                    user?.authProvider === "google" ? "text-gray-400 cursor-not-allowed" : "text-white"
                  }`}
                />
                {user?.authProvider === "google" && (
                  <p className="text-xs text-gray-500 mt-1">Email is linked to your Google account</p>
                )}
              </div>

              {/* Auth Provider Info */}
              <div className="bg-white/5 rounded-xl p-4 border border-gray-700/50">
                <p className="text-sm text-gray-400">Account Type</p>
                <p className="text-white font-medium capitalize flex items-center gap-2 mt-1">
                  {user?.authProvider === "google" && "🔴 Google Account"}
                  {user?.authProvider === "phone" && "📱 Phone Login"}
                  {user?.authProvider === "local" && "📧 Email & Password"}
                  {!user?.authProvider && "📧 Email & Password"}
                </p>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default ProfileEditPage;
