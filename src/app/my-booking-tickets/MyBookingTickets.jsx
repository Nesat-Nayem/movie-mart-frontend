"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";

const bookings = [
  {
    id: 1,
    title: "Spider-Man: No Way Home",
    date: "24 Sept 2025, 7:30PM",
    venue: "INOX Cinema, Delhi",
    price: "₹450",
    tickets: 2,
    poster: "/assets/img/movies/1.avif",
  },
  {
    id: 2,
    title: "Coldplay: Music Of The Spheres Tour",
    date: "30 Sept 2025, 6:00PM",
    venue: "Jawaharlal Nehru Stadium, Delhi",
    price: "₹1200",
    tickets: 4,
    poster: "/assets/img/events/1.png",
  },
];

const MyBookingTickets = () => {
  const router = useRouter();
  return (
    <section className="min-h-screen bg-[#0B1730] px-4 text-white py-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">🎟 My Booking Tickets</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-400">No tickets booked yet.</p>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row gap-4 bg-white/5 rounded-xl p-3 border border-gray-700"
              >
                {/* Poster */}
                <div className="flex-shrink-0">
                  <Image
                    src={booking.poster}
                    alt={booking.title}
                    width={120}
                    height={160}
                    className="rounded-lg object-cover w-28 h-36"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{booking.title}</h2>
                    <p className="text-sm text-gray-300 mt-1">{booking.date}</p>
                    <p className="text-sm text-gray-400">{booking.venue}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {booking.tickets} Ticket(s) • {booking.price} each
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-3 sm:mt-0">
                    <Button
                      onClick={() =>
                        router.push(`/profile-settings/movie-ticket`)
                      }
                      className="w-full sm:w-auto text-xs"
                    >
                      View Ticket
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingTickets;
