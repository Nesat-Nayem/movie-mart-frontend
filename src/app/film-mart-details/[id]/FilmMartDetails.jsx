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
import { useParams, useRouter } from "next/navigation";
import FilmMartHeader from "./FilmMartHeader";
import RecommandedMovies from "../../pages/Hero/RecommandedMovies";
import Advertise from "@/app/components/Advertise";
import { useGetMoviesQuery } from "../../../../store/moviesApi";
const FilmMartDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data: moviesData = [], isLoading, isError } = useGetMoviesQuery();

  // Find current movie by ID
  const movie = moviesData?.find((item) => item._id === id);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <div className="min-h-screen text-white">
          {/* Header Section */}
          <FilmMartHeader />

          {/* If API loading */}
          {isLoading && (
            <p className="text-center py-10 text-gray-400">Loading...</p>
          )}

          {/* If error */}
          {isError && (
            <p className="text-center py-10 text-red-500">
              Failed to load movie details.
            </p>
          )}

          {/* Movie Info */}
          {!isLoading && movie && (
            <>
              <div className="px-4 mt-4">
                <h1 className="text-2xl font-bold">{movie.title}</h1>
                <p className="text-gray-400 text-sm">
                  {formatDate(movie.releaseDate)} | {movie.duration} |{" "}
                  {movie.genres.join(", ")}
                </p>

                {/* Format + Language */}
                <div className="flex items-center gap-3 mt-4">
                  <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                    2D
                  </button>
                  <button className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20 active:bg-yellow-500/30">
                    Hindi
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
                          <span className="font-medium text-white">
                            Producer:
                          </span>{" "}
                          {movie.producer}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clapperboard className="w-5 h-5 text-blue-400" />
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">
                            Director:
                          </span>{" "}
                          {movie.director}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-green-400" />
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">
                            Production House:
                          </span>{" "}
                          {movie?.company?.productionHouse}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <Actions />
                </div>

                {/* Synopsis */}
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Book Tickets */}
              {/* Buy Movie */}
              <div className="px-4 mt-6">
                <h2 className="text-lg font-semibold mb-2">Buy This Movie</h2>

                <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Own the Full Movie</p>
                    <p className="text-gray-400 text-sm">
                      Lifetime access • Watch anytime
                    </p>
                  </div>
                </div>
              </div>

              {/* Cast */}
              <div className="px-4 mt-8">
                <h2 className="text-lg font-semibold mb-3">Cast</h2>

                {movie?.castCrew?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {movie.castCrew.map((person, idx) => (
                      <div key={idx} className="w-24 flex-shrink-0 text-center">
                        <Image
                          src={person.image || "/assets/img/default-avatar.png"}
                          alt={person.name}
                          width={100}
                          height={100}
                          className="w-20 h-20 rounded-full object-cover mx-auto"
                        />

                        <p className="mt-2 text-sm font-medium">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-400">{person.role}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No Cast Available</p>
                )}
              </div>

              {/* Crew */}
              <div className="px-4 mt-8">
                <h2 className="text-lg font-semibold mb-3">Crew</h2>

                {movie?.castCrew?.filter((p) => p.role !== "Actor")?.length >
                0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {movie.castCrew
                      .filter((p) => p.role !== "Actor") // only directors, producers, etc.
                      .map((person, idx) => (
                        <div
                          key={idx}
                          className="w-24 flex-shrink-0 text-center"
                        >
                          <Image
                            src={
                              person.image || "/assets/img/default-avatar.png"
                            }
                            alt={person.name}
                            width={100}
                            height={100}
                            className="w-20 h-20 rounded-full object-cover mx-auto"
                          />
                          <p className="mt-2 text-sm font-medium">
                            {person.name}
                          </p>
                          <p className="text-xs text-gray-400">{person.role}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No Crew Available</p>
                )}
              </div>

              {/* ads  */}
              <Advertise />

              {/* Recommended Movies */}
              <RecommandedMovies />

              {/* Company Details */}
              <div className="bg-white/5 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Company Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-pink-500" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">
                        Production House:
                      </span>{" "}
                      {movie?.company?.productionHouse}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Address:</span>{" "}
                      {movie?.company?.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-yellow-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">State:</span>{" "}
                      {movie?.company?.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Country:</span>{" "}
                      {movie?.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Phone:</span> +91
                      {movie?.company?.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-red-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Email:</span>{" "}
                      {movie?.company?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-indigo-400" />
                    <p className="text-gray-300 text-sm">
                      <span className="font-medium text-white">Website:</span>{" "}
                      {movie?.company?.website}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Fixed Button */}
          <div className="fixed  bottom-0 left-0 right-0 bg-[#0B1730] border-t border-gray-700 p-4 z-50">
            <Button
              onClick={() => router.push("/film-mart/enquiry-now")}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium max-w-xl mx-auto flex items-center justify-center gap-2"
            >
              Enquiry Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilmMartDetails;
