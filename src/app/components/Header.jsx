import Link from "next/link";
import React from "react";
import {
  FaFilm,
  FaCalendarAlt,
  FaTicketAlt,
  FaShoppingCart,
  FaShoppingBasket,
} from "react-icons/fa";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a] text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left Menu */}
        <ul className="flex items-center flex-nowrap space-x-1 sm:space-x-2 md:space-x-4 text-xs sm:text-sm md:text-base font-medium">
          <li className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl cursor-pointer hover:text-red-400 hover:bg-gray-700 transition whitespace-nowrap">
            <FaShoppingBasket className="text-sm sm:text-base" />
            <Link href="/film-mart">Film Mart</Link>
          </li>
          <li className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl cursor-pointer hover:text-red-400 hover:bg-gray-700 transition whitespace-nowrap">
            <FaCalendarAlt className="text-sm sm:text-base" />
            <Link href="/events">Events</Link>
          </li>
          {/* <li className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl cursor-pointer hover:text-red-400 hover:bg-gray-700 transition whitespace-nowrap">
            <FaTicketAlt className="text-sm sm:text-base" />
            <Link href="/book-tickets">Book Ticket</Link>
          </li> */}
          <li className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-xl cursor-pointer hover:text-red-400 hover:bg-gray-700 transition whitespace-nowrap">
            <FaFilm className="text-sm sm:text-base" />
            <Link href="/watch-movies">Watch Movies</Link>
          </li>
        </ul>
        {/* Right Scrolling Offers - Visible on md and larger devices only */}
        <div className="hidden md:block w-1/2 overflow-hidden relative">
          <marquee>
            <div className="whitespace-nowrap text-sm text-yellow-400 font-semibold">
              🎉 50% Off on First Booking &nbsp; | &nbsp; Free Popcorn with
              Every Movie Ticket &nbsp; | &nbsp; Upcoming Events Sale 🎟️
            </div>
          </marquee>
        </div>
      </div>
    </header>
  );
};

export default Header;
