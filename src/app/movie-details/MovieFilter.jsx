import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";

export default function DateSelector() {
  const [selectedDate, setSelectedDate] = useState(20);
  const [hovered, setHovered] = useState(null); // track hovered showtime

  const dates = [
    { day: 20, label: "Sat" },
    { day: 21, label: "Sun" },
    { day: 22, label: "Mon" },
    { day: 23, label: "Tue" },
    { day: 24, label: "Wed" },
    { day: 25, label: "Thu" },
  ];

  const cinemas = [
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
    {
      logo: "/assets/img/movies/c1.png",
      name: "INOX AIPL Joy Street, AIPL Joystreet Mall, Gurugram",
      rating: "3.7/10",
      distance: "4.4Km Away",
      cancellationAllowed: true,
      shows: [
        {
          time: "04:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "ALMOST FULL" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "06:30 PM",
          status: "filling",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
        {
          time: "08:30 PM",
          status: "almost",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },

        {
          time: "10:30 PM",
          status: "available",
          seats: [
            { type: "Executive", price: 360, status: "AVAILABLE" },
            { type: "Club", price: 450, status: "AVAILABLE" },
            { type: "Royal", price: 480, status: "AVAILABLE" },
            { type: "Royal Recliner", price: 680, status: "SOLD OUT" },
          ],
        },
      ],
    },
  ];

  // button colors
  const statusColors = {
    available:
      "border-gray-300 text-green-700 hover:bg-green-500 hover:text-white",
    filling:
      "border-yellow-400 text-yellow-600 hover:bg-yellow-500 hover:text-white",
    almost: "border-red-400 text-red-600 hover:bg-red-500 hover:text-white",
  };

  // tooltip seat status colors
  const seatStatusColors = {
    AVAILABLE: "text-green-600",
    "ALMOST FULL": "text-red-600",
    "SOLD OUT": "text-gray-400",
  };

  return (
    <section className="py-10">
      <div className="max-w-4xl mx-auto">
        {/* Dates */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <div className="flex flex-col items-center text-xs ">
            <span className="rotate-90">SEP</span>
          </div>
          {dates.map((date) => (
            <button
              key={date.day}
              onClick={() => setSelectedDate(date.day)}
              className={`flex flex-col items-center justify-center w-12 h-16 rounded-lg transition 
              ${
                selectedDate === date.day
                  ? "bg-black text-white"
                  : " hover:bg-black"
              }`}
            >
              <span className="text-lg font-bold">{date.day}</span>
              <span className="text-sm">{date.label}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="flex items-center gap-1 px-4 py-2 border rounded-lg text-sm ">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm ">
            After 5 PM
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm ">
            Recliners
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm ">
            Wheelchair Friendly
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm ">
            Premium Seats
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-6 bg-gray-100 px-4 py-3 rounded">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="border px-1 text-xs rounded">CC</span> English
            subtitle
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-3 h-3 rounded-full bg-black"></span> Available
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Filling
            fast
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-3 h-3 rounded-full bg-red-400"></span> Almost
            full
          </span>
        </div>
      </div>

      {/* Cinemas & Showtimes */}
      <div className="max-w-5xl mx-auto mt-8 space-y-6">
        {cinemas.map((cinema, idx) => (
          <div
            key={idx}
            className="rounded-2xl shadow p-6 border-b border-dotted border-gray-500"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              {/* Logo + Name */}
              <div className="flex items-center gap-3">
                {cinema.logo ? (
                  <Image
                    src={cinema.logo}
                    alt={cinema.name}
                    className="w-10 h-10 rounded-full object-contain"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs">
                    {cinema.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold truncate max-w-[220px] sm:max-w-[400px]">
                    {cinema.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {cinema.distance && <span>{cinema.distance}</span>}
                    {cinema.cancellationAllowed && (
                      <>
                        <span className="hidden sm:inline">|</span>
                        <span className="text-green-600">
                          Free Cancellation
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <span className="text-sm text-gray-500">⭐ {cinema.rating}</span>
            </div>

            {/* Showtimes with tooltip */}
            <div className="flex flex-wrap gap-3">
              {cinema.shows.map((show, i) => {
                const key = `${idx}-${i}`;
                const isOpen = hovered === key;

                return (
                  <div
                    key={i}
                    className="relative"
                    onMouseEnter={() => setHovered(key)} // desktop hover
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered(isOpen ? null : key)} // mobile tap toggle
                  >
                    <button
                      className={`px-4 py-2 rounded-lg border transition ${
                        statusColors[show.status]
                      }`}
                    >
                      {show.time}
                    </button>

                    {/* Tooltip */}
                    {isOpen && (
                      <div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
                                w-[90vw] sm:w-max max-w-sm sm:max-w-none 
                                bg-black text-white shadow-lg rounded-lg px-4 py-3 z-20"
                      >
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                          {show.seats.map((seat, j) => (
                            <div key={j} className="text-center">
                              <p className="font-medium">{seat.type}</p>
                              <p className="font-semibold">₹{seat.price}</p>
                              <p
                                className={`text-xs font-bold ${
                                  seatStatusColors[seat.status]
                                }`}
                              >
                                {seat.status}
                              </p>
                            </div>
                          ))}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 w-3 h-3 bg-black rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
