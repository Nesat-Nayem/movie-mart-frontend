"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Map,
  Star,
  Clock,
  Calendar,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { User, Clapperboard, Building2 } from "lucide-react";
import Button from "@/app/components/Button";
import Actions from "./Actions";
import { useParams, useRouter } from "next/navigation";
import FilmMartHeader from "./FilmMartHeader";
import RecommandedMovies from "../../pages/Hero/RecommandedMovies";
import Advertise from "@/app/components/Advertise";
import { useGetMovieByIdQuery } from "../../../../store/moviesApi";
import { useAuth } from "@/context/AuthContext";

// Vendor Access Modal Component
const VendorAccessModal = ({ isOpen, onClose, onBecomePartner }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-md w-full p-6 md:p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-3">
          Vendor Access Only
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-center mb-6 leading-relaxed">
          Film Trade details are exclusively available for verified vendor partners. 
          Become a partner to access film rights, pricing, and business opportunities.
        </p>

        {/* Benefits */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">Access exclusive film trade deals</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">View country-wise asking prices</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">Connect with production houses</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-sm text-gray-300">List your own films for trade</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onBecomePartner}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
          >
            Become a Partner
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-white/10"
          >
            Close
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Already a vendor? Make sure you're logged in with your vendor account.
        </p>
      </div>
    </div>
  );
};

// Modern Shimmer Skeleton
const MovieDetailsSkeleton = () => (
  <div className="min-h-screen text-white pb-24">
    {/* Header Skeleton */}
    <div className="w-full h-[200px] sm:h-[320px] lg:h-[400px] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-b-2xl" />
    
    <div className="px-4 md:px-8  mt-4 space-y-6">
      {/* Title */}
      <div className="space-y-3">
        <div className="h-8 w-2/3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        <div className="h-4 w-1/2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
      </div>
      
      {/* Format buttons */}
      <div className="flex gap-3">
        <div className="h-10 w-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        <div className="h-10 w-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
      </div>
      
      {/* Crew + Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-800/50 rounded-xl p-4 space-y-3">
          <div className="h-5 w-32 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-4 w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-4 w-3/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-4 w-2/3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-12 w-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
          <div className="h-12 w-12 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        <div className="h-4 w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        <div className="h-4 w-2/3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
      </div>
      
      {/* Cast */}
      <div className="space-y-3">
        <div className="h-6 w-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 text-center space-y-2">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full mx-auto" />
              <div className="h-3 w-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer bg-[length:200%_100%] rounded-full mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FilmMartDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [showAccessModal, setShowAccessModal] = useState(false);

  // Check if user is a vendor
  const isVendor = user?.role === 'vendor' || user?.role === 'admin';

  // Fetch single movie by ID - more efficient than fetching all movies
  const { data: movie, isLoading, isError } = useGetMovieByIdQuery(id, {
    skip: !id,
  });

  // Show access modal for non-vendor users after auth loads
  useEffect(() => {
    if (!authLoading && !isVendor) {
      setShowAccessModal(true);
    }
  }, [authLoading, isVendor]);

  // Handle become partner button
  const handleBecomePartner = () => {
    router.push('/become-vendor');
  };

  // Handle close modal - redirect to film mart list
  const handleCloseModal = () => {
    setShowAccessModal(false);
    router.push('/film-mart');
  };

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

  // Show skeleton while loading
  if (isLoading) {
    return (
      <section>
        <div className="w-full">
          <MovieDetailsSkeleton />
        </div>
      </section>
    );
  }

  // Error state
  if (isError || !movie) {
    return (
      <section>
        <div className="w-full px-4 md:px-8  py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎬</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">The movie you are looking for does not exist or has been removed.</p>
            <Button onClick={() => router.push("/film-mart")} className="bg-pink-600 hover:bg-pink-700">
              Back to Film Mart
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Get cast and crew from movie data
  const castMembers = movie.cast || movie.castCrew?.filter(p => 
    p.role === "actor" || p.role === "actress" || p.role === "Actor" || p.role === "Actress"
  ) || [];
  
  const crewMembers = movie.crew || movie.castCrew?.filter(p => 
    p.role !== "actor" && p.role !== "actress" && p.role !== "Actor" && p.role !== "Actress"
  ) || [];

  // If not vendor, show modal and restricted content
  if (!isVendor && !authLoading) {
    return (
      <section>
        <VendorAccessModal 
          isOpen={showAccessModal}
          onClose={handleCloseModal}
          onBecomePartner={handleBecomePartner}
        />
        {/* Show blurred/restricted background */}
        <div className="w-full min-h-screen relative">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          <div className="relative px-4 md:px-8  py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Vendor Access Required</h2>
              <p className="text-gray-400 mb-8">
                This Film Trade details page is exclusively available for verified vendor partners.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleBecomePartner}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                >
                  Become a Partner
                </button>
                <button
                  onClick={() => router.push('/film-mart')}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-xl transition-colors"
                >
                  Back to Film Mart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="w-full">
        <div className="min-h-screen text-white pb-24">
          {/* Header Section with Video/Poster */}
          <FilmMartHeader movie={movie} />

          {/* Movie Info */}
          <div className="px-4 md:px-8  mt-4">
            {/* Title and Basic Info */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-gray-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(movie.releaseDate)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {movie.duration} min
                  </span>
                  {movie.imdbRating > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        {movie.imdbRating.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  {movie.genres?.join(", ")}
                </p>
              </div>
            </div>

            {/* Format + Language Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {movie.formats?.map((format, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium">
                  {format}
                </span>
              ))}
              {movie.languages?.map((lang, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-300 text-sm font-medium">
                  {lang}
                </span>
              ))}
            </div>

                   {/* Synopsis */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Crew + Buttons */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-6 gap-4">
              {/* Crew Details */}
              <div className="bg-white/5 rounded-xl p-4 flex-1">
                <h2 className="text-lg font-semibold mb-3">Crew Details</h2>
                <div className="space-y-3">
                  {movie.producer && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-pink-500" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Producer:</span> {movie.producer}
                      </p>
                    </div>
                  )}
                  {movie.director && (
                    <div className="flex items-center gap-3">
                      <Clapperboard className="w-5 h-5 text-blue-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Director:</span> {movie.director}
                      </p>
                    </div>
                  )}
                  {movie.company?.productionHouse && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-green-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Production House:</span> {movie.company.productionHouse}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <Actions movie={movie} />
            </div>

     



          </div>

          {/* Buy Movie Section */}
          {movie.status === "released" && (
            <div className="px-4 md:px-8  mt-6">
              <h2 className="text-lg font-semibold mb-2">Buy This Movie</h2>
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 flex justify-between items-center border border-pink-500/30">
                <div>
                  <p className="font-medium">Own the Full Movie</p>
                  <p className="text-gray-400 text-sm">Lifetime access • Watch anytime</p>
                </div>
                {movie.productionCost > 0 && (
                  <p className="text-xl font-bold text-green-400">₹{movie.productionCost}</p>
                )}
              </div>
            </div>
          )}

          {/* Cast Section */}
          <div className="px-4 md:px-8  mt-8">
            <h2 className="text-lg font-semibold mb-3">Cast</h2>
            {castMembers.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {castMembers.map((person, idx) => (
                  <div key={idx} className="w-24 flex-shrink-0 text-center">
                    <div className="relative w-20 h-20 mx-auto">
                      <Image
                        src={person.image || person.profileImage || "/assets/img/default-avatar.png"}
                        alt={person.name}
                        fill
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1">{person.name}</p>
                    <p className="text-xs text-gray-400">{person.type || person.characterName || person.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No cast information available</p>
            )}
          </div>

          {/* Crew Section */}
          <div className="px-4 md:px-8  mt-8">
            <h2 className="text-lg font-semibold mb-3">Crew</h2>
            {crewMembers.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                {crewMembers.map((person, idx) => (
                  <div key={idx} className="w-24 flex-shrink-0 text-center">
                    <div className="relative w-20 h-20 mx-auto">
                      <Image
                        src={person.image || person.profileImage || "/assets/img/default-avatar.png"}
                        alt={person.name}
                        fill
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1">{person.name}</p>
                    <p className="text-xs text-gray-400">{person.designation || person.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No crew information available</p>
            )}
          </div>

          {/* Asking Price Section - Country-wise Pricing */}
          {movie.countryPricing && movie.countryPricing.length > 0 && (
            <div className="px-4 md:px-8  mt-8">
              <div className="bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-red-900/20 rounded-2xl p-5 md:p-6 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-white">Asking Price</h2>
                    <p className="text-xs text-gray-400">Country-wise film rights pricing</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.countryPricing.map((pricing, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {pricing.countryCode === 'IN' ? '🇮🇳' :
                             pricing.countryCode === 'US' ? '🇺🇸' :
                             pricing.countryCode === 'GB' ? '🇬🇧' :
                             pricing.countryCode === 'AE' ? '🇦🇪' :
                             pricing.countryCode === 'AU' ? '🇦🇺' :
                             pricing.countryCode === 'CA' ? '🇨🇦' :
                             pricing.countryCode === 'DE' ? '🇩🇪' :
                             pricing.countryCode === 'FR' ? '🇫🇷' :
                             pricing.countryCode === 'JP' ? '🇯🇵' :
                             pricing.countryCode === 'CN' ? '🇨🇳' :
                             pricing.countryCode === 'SG' ? '🇸🇬' :
                             pricing.countryCode === 'MY' ? '🇲🇾' :
                             pricing.countryCode === 'SA' ? '🇸🇦' :
                             pricing.countryCode === 'ZA' ? '🇿🇦' :
                             pricing.countryCode === 'BR' ? '🇧🇷' :
                             pricing.countryCode === 'RU' ? '🇷🇺' :
                             pricing.countryCode === 'KR' ? '🇰🇷' :
                             pricing.countryCode === 'NZ' ? '🇳🇿' :
                             pricing.countryCode === 'BD' ? '🇧🇩' :
                             pricing.countryCode === 'PK' ? '🇵🇰' : '🌍'}
                          </span>
                          <span className="font-semibold text-white">{pricing.countryName}</span>
                        </div>
                        {pricing.negotiable && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            Negotiable
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-400">{pricing.currency}</span>
                        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          {pricing.askingPrice?.toLocaleString() || '0'}
                        </span>
                      </div>
                      
                      {pricing.notes && (
                        <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                          {pricing.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-5 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-400 text-center">
                    💡 Contact us for detailed pricing information and negotiations
                  </p>
                </div>
              </div>
            </div>
          )}

               {/* Company Details */}
          {movie.company && (
            <div className="px-4 md:px-8  mt-8">
              <div className="bg-white/5 rounded-xl p-5">
                <h2 className="text-lg font-semibold mb-4">Company Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {movie.company.productionHouse && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-pink-500" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Production House:</span> {movie.company.productionHouse}
                      </p>
                    </div>
                  )}
                  {movie.company.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Address:</span> {movie.company.address}
                      </p>
                    </div>
                  )}
                  {movie.company.state && (
                    <div className="flex items-center gap-3">
                      <Map className="w-5 h-5 text-yellow-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">State:</span> {movie.company.state}
                      </p>
                    </div>
                  )}
                  {movie.country && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Country:</span> {movie.country}
                      </p>
                    </div>
                  )}
                  {movie.company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-purple-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Phone:</span> +91 {movie.company.phone}
                      </p>
                    </div>
                  )}
                  {movie.company.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-red-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Email:</span> {movie.company.email}
                      </p>
                    </div>
                  )}
                  {movie.company.website && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-indigo-400" />
                      <p className="text-gray-300 text-sm">
                        <span className="font-medium text-white">Website:</span> {movie.company.website}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ads */}
          <Advertise />

          {/* Recommended Movies */}
          <RecommandedMovies />

     

          {/* Bottom Fixed Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#0B1730] border-t border-gray-700 p-4 z-50">
            <Button
              onClick={() => router.push(`/film-mart/enquiry-now?movie=${id}`)}
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
