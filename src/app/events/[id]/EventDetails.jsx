"use client";

import React, { useState } from "react";
import {
  User,
  Clapperboard,
  Building2,
  Map,
  Building2Icon,
  Building,
  MapPin,
  Armchair,
  Ticket,
  Calendar,
  Clock,
  Users,
  Share2,
  Heart,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/Button";
import Actions from "./Actions";
import { useParams, useRouter } from "next/navigation";
import EventHeader from "./EventHeader";
import BookTicketDrawer from "@/app/events/BookTicketDrawer";
import { useGetEventByIdQuery } from "../../../../store/eventsApi";
import Logo from "@/app/components/Logo";

const EventDetails = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  // Use the single event query instead of fetching all events
  const { data: event, isLoading, isError, error } = useGetEventByIdQuery(id, {
    skip: !id,
  });

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

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ⬅️ Enables AM / PM
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744]">
        <div className="max-w-6xl mx-auto">
          <EventHeader />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading event details...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (isError || !event) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-[#0B1730] to-[#1a2744]">
        <div className="max-w-6xl mx-auto">
          <EventHeader />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
              <p className="text-gray-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <Link href="/events">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Calculate ticket availability
  const isEventAvailable = event.availableSeats > 0 && ['upcoming', 'ongoing'].includes(event.status);
  const ticketPercentage = Math.round((event.totalTicketsSold / event.totalSeats) * 100);

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <div className="min-h-screen text-white">
          {/* Header Section */}
          <EventHeader />

          {/* events information */}
          {event && (
            <>
              <div>
                {/* Movie Info */}
                <div className="px-4 mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold capitalize">
                      {event.title}
                    </h1>
                    <p className="text-yellow-400 text-sm font-bold bg-yellow-200/10 px-2 py-1 rounded-full">
                      {event.eventLanguage || "Hindi"}
                    </p>
                  </div>
                  
                  {/* Event Status Badge */}
                  {event.status && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' :
                        event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                        event.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                      {ticketPercentage >= 80 && isEventAvailable && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                          🔥 Filling Fast
                        </span>
                      )}
                    </div>
                  )}

                  {/* Format + Language */}
                  <div className="flex items-center gap-3 mt-4">
                    <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20">
                      {formatDate(event.startDate)} |{" "}
                      {formatTime(event.startTime)}
                    </button>

                    <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/10 text-sm font-medium transition hover:bg-white/20">
                      {formatDate(event.endDate)} | {formatTime(event.endTime)}
                    </button>
                  </div>

                  {/* Crew + Buttons */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mt-6 gap-4">
                    {/* Crew Details */}
                    <div className="bg-white/5 rounded-xl p-4 flex-1">
                      <h2 className="text-lg font-semibold mb-3">
                        Event Details
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Row */}
                        <div className="flex items-start gap-3">
                          <Map className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Venue Name
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.location.venueName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Address
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.location.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building2Icon className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              City
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.location.city}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              State
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.location.state}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Postal Code
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.location.postalCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Ticket className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Ticket Price
                            </p>
                            <p className="text-gray-300 text-sm">
                              ₹ {event.ticketPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Armchair className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Total Seats
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.totalSeats}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Armchair className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="text-white font-medium text-sm">
                              Available Seats
                            </p>
                            <p className="text-gray-300 text-sm">
                              {event.availableSeats}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <Actions />
                  </div>

                  {/* Synopsis */}
                  <p className="mt-4 text-gray-300 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
                {/* Book Tickets */}
                <div className="px-4 mt-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Available in Tickets
                  </h2>
                  <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Book Your Tickets Now!</p>
                    </div>
                    <button
                      onClick={() => setShowDrawer(true)}
                      className="bg-pink-600 px-4 py-2 rounded-lg text-sm hover:bg-pink-700"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
                {/* Cast */}{" "}
                <div className="px-4 mt-8">
                  {" "}
                  <h2 className="text-lg font-semibold mb-3">
                    Performers
                  </h2>{" "}
                  <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {event.performers.map((person, idx) => (
                      <div key={idx} className="w-24 flex-shrink-0 text-center">
                        {person.img && person.img.trim() !== "" ? (
                          <Image
                            src={person.img}
                            alt={person.name || "Performer"}
                            width={100}
                            height={100}
                            className="w-20 h-20 rounded-full object-cover mx-auto"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                            <Logo className="w-10 h-10 opacity-80" />
                          </div>
                        )}

                        <p className="mt-2 text-sm font-medium">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-400">{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>{" "}
                {/* Crew */}{" "}
                <div className="px-4 mt-8">
                  {" "}
                  <h2 className="text-lg font-semibold mb-3">
                    Organizers
                  </h2>{" "}
                  <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
                    {event.organizers.map((person, idx) => (
                      <div
                        key={idx}
                        className="min-w-[140px] bg-white/5 backdrop-blur-md p-4 rounded-xl shadow-sm flex-shrink-0 text-center border border-white/10"
                      >
                        {person.img && person.img.trim() !== "" ? (
                          <Image
                            src={person.img}
                            alt={person.name || "Organizer"}
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full object-cover mx-auto"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                            <Logo className="w-12 h-12 opacity-80" />
                          </div>
                        )}

                        <p className="mt-3 text-sm font-semibold">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-400">{person.email}</p>
                        <p className="text-xs text-gray-400">{person.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>{" "}
                {/* Bottom Fixed Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#0B1730]/95 backdrop-blur-lg border-t border-gray-700 p-4 z-50">
                  <div className="max-w-xl mx-auto">
                    {isEventAvailable ? (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs">Starting from</p>
                          <p className="text-white font-bold text-xl">₹{event.ticketPrice}</p>
                        </div>
                        <Button
                          onClick={() => setShowDrawer(true)}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 py-3 rounded-xl font-semibold"
                        >
                          <Ticket className="w-5 h-5 mr-2" />
                          Book Tickets
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-red-400 font-semibold">
                          {event.status === 'completed' ? '🎬 Event Ended' : 
                           event.status === 'cancelled' ? '❌ Event Cancelled' : 
                           '😔 Sold Out'}
                        </p>
                        <p className="text-gray-500 text-sm">Check out other events</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && event && (
        <BookTicketDrawer
          event={event}
          onClose={() => setShowDrawer(false)}
        />
      )}
    </section>
  );
};

export default EventDetails;
