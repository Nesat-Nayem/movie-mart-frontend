"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";

const ProfileEditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  const [formData, setFormData] = useState({
    name: "rgn",
    phone: "+91 9290909909",
    email: "user@example.com",
    gender: "",
    birthday: "",
    anniversary: "",
  });

  useEffect(() => {
    if (searchParams.get("modal") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", formData);
    setIsModalOpen(false);
    router.push("/profile");
  };

  return (
    <>
      {isModalOpen && (
        <div className="flex items-center py-4 justify-center bg-[#13162f] bg-opacity-70">
          <div className="w-full max-w-lg mx-4 rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh] no-scrollbar border border-dotted bg-[#13162f]">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6 cursor-pointer">
              <button
                onClick={() => router.push("/profile")}
                className="text-2xl hover:text-gray-300"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-xl font-semibold">Edit Profile</h1>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl">👤</span>
                  )}
                </div>

                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 cursor-pointer"
                >
                  <FaCamera size={14} />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  disabled
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Submit */}
              <div>
                <Button type="submit">Update Profile</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEditPage;
