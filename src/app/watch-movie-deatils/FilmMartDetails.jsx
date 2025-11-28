"use client";

import React from "react";
import {
  Play,
  Bookmark,
  Share2,
  MapPin,
  Globe,
  Phone,
  Mail,
  Map,
} from "lucide-react";
import Image from "next/image";
import { User, Clapperboard, Building2 } from "lucide-react";
import Link from "next/link";
import Button from "@/app/components/Button";
import Actions from "./Actions";
import { useRouter } from "next/navigation";
import FilmMartHeader from "./FilmMartHeader";
import RecommandedMovies from "./RecommandedMovies";

const FilmMartDetails = () => {
  const router = useRouter();
  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <div className="min-h-screen text-white">
          {/* Header Section */}
          <FilmMartHeader />

          {/* Movie Info */}
          <div className="px-4 mt-4">
            <h1 className="text-2xl font-bold">
              Mirai - OFFICIAL TRAILER (HINDI) | Teja S | Manchu M | Ritika N |
              Karthik G
            </h1>
            <p className="text-gray-400 text-sm">
              12 Sept 2025 | 2h 20m | Drama
            </p>

            {/* Format + Language */}
            <div className="flex items-center gap-3 mt-4">
              <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                Trailer
              </button>
              <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                2D
              </button>
              <button className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                Hindi
              </button>
              <button className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                🔔 Subscribed
              </button>
            </div>

            {/* Crew + Buttons */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-6 gap-4">
              {/* Crew Details */}
              <div className="bg-white/5 rounded-xl p-4 flex-1">
                <h2 className="text-lg font-semibold mb-3">Crew Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-pink-500" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Producer:</span>{" "}
                      Sajid Nadiadwala
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clapperboard className="w-5 h-5 text-blue-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Director:</span>{" "}
                      Subhash Kapoor
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-green-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">
                        Production House:
                      </span>{" "}
                      Nadiadwala Grandson Entertainment
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <Actions />
            </div>
          </div>

          {/* Cast */}
          <div className="px-4 mt-8">
            <h2 className="text-lg font-semibold mb-3">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
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
              ].map((person, idx) => (
                <div key={idx} className="w-24 flex-shrink-0 text-center">
                  <Image
                    src={person.img}
                    alt={person.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                  <p className="mt-2 text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crew */}
          <div className="px-4 mt-1">
            <h2 className="text-lg font-semibold mb-3">Crew</h2>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {[
                {
                  img: "/assets/img/movies/c5.jpg",
                  name: "Subhash Kapoor",
                  role: "Director",
                },
                {
                  img: "/assets/img/movies/c6.jpg",
                  name: "Producer Name",
                  role: "Producer",
                },
              ].map((person, idx) => (
                <div key={idx} className="w-24 flex-shrink-0 text-center">
                  <Image
                    src={person.img}
                    alt={person.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                  <p className="mt-2 text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Movies */}
          <RecommandedMovies />
        </div>
      </div>
    </section>
  );
};

export default FilmMartDetails;
