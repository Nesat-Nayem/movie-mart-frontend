"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

const MovieDetailsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Reviews");

  const tabs = ["Reviews", "Synopsis", "Cast & Crew", "Videos", "Posters"];

  const reviews = [
    {
      logo: "/assets/img/movies/1.avif",
      name: "Bollywood Hungama",
      rating: "3.5/5",
      review:
        "Subhash Kapoor's story is relatable. The screenplay is peppered with humor and courtroom drama.",
    },
    {
      logo: "/assets/img/movies/1.avif",
      name: "Times of India",
      rating: "3.5/5",
      review:
        "The third instalment of the courtroom comedy-drama hits the right balance of satire and emotion.",
    },
    {
      logo: "/assets/img/movies/1.avif",
      name: "NDTV",
      rating: "3.0/5",
      review:
        "A decent watch with strong performances, though pacing could have been tighter.",
    },
  ];

  return (
    <div>
      {/* Trigger Button */}
      <div className="mt-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-white text-black text-xs cursor-pointer rounded-lg shadow hover:bg-red-700 hover:text-white transition"
        >
          View Details
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center  z-50 px-2 sm:px-4">
          <div className="bg-black rounded-2xl shadow-lg w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-700 cursor-pointer text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <h2 className="text-lg sm:text-xl font-bold">Movie details</h2>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Mirai - OFFICIAL TRAILER (HINDI) | Teja S | Manchu M | Ritika N |
              Karthik G
            </p>

            {/* Tabs */}
            <div className="flex gap-4 sm:gap-6 border-b border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab
                      ? "border-b-2 border-yellow-500 font-medium text-yellow-300"
                      : "hover:text-yellow-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "Reviews" && (
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  User Reviews
                </h2>

                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 2 },
                  }}
                >
                  {reviews.map((review, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="p-4 bg-white/10 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.logo}
                            alt={review.name}
                            className="w-10 h-10 rounded object-contain"
                          />
                          <div>
                            <p className="text-sm font-semibold">
                              {review.name}
                            </p>
                            <p className="text-xs sm:text-sm">
                              {review.rating}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                          {review.review}
                        </p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {activeTab === "Synopsis" && (
              <div>
                <h3 className="mb-3 text-lg font-semibold">Synopsis</h3>
                <p className="text-justify text-xs sm:text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>
              </div>
            )}

            {activeTab === "Cast & Crew" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-4">
                {[
                  {
                    img: "/assets/img/movies/c2.jpg",
                    name: "Akshay Kumar",
                    role: "Actor",
                  },
                  {
                    img: "/assets/img/movies/c3.jpg",
                    name: "Arshad Warsi",
                    role: "Actor",
                  },
                  {
                    img: "/assets/img/movies/c4.jpg",
                    name: "Subhash Kapoor",
                    role: "Director",
                  },
                  {
                    img: "/assets/img/movies/c5.jpg",
                    name: "Amitabh Bachchan",
                    role: "Producer",
                  },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center"
                  >
                    <Image
                      src={person.img}
                      alt={person.name}
                      width={100}
                      height={100}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow"
                    />
                    <h3 className="mt-2 text-sm sm:text-base font-semibold">
                      {person.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {person.role}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Videos" && (
              <div className="aspect-video mt-4">
                <iframe
                  width="100%"
                  height="100%"
                  src="/assets/img/events/event-video.mp4"
                  title="Jolly LLB 3 Trailer"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            )}

            {activeTab === "Posters" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {["11.avif", "13.jpg", "14.jpg", "15.jpg"].map((img, i) => (
                  <Image
                    key={i}
                    src={`/assets/img/movies/${img}`}
                    alt={`Poster ${i + 1}`}
                    className="rounded-lg shadow w-full h-36 sm:h-40 object-cover"
                    width={500}
                    height={200}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsModal;
