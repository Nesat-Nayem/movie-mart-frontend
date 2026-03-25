"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCentos, FaChromecast } from "react-icons/fa";
import { FaClapperboard } from "react-icons/fa6";

const BottomNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/film-mart", icon: FaClapperboard, label: "Film Trade" },
    { href: "/events", icon: FaCentos, label: "Events" },
    { href: "/watch-movies", icon: FaChromecast, label: "Watch Movies" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden">
      <div className="relative flex items-end justify-between w-[320px] md:w-[450px] bg-[#0f172a] rounded-full shadow-xl px-6 py-3">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={index}
              href={item.href}
              className="relative flex flex-col items-center justify-end w-full"
            >
              {/* Active Floating Circle */}
              {isActive && (
                <div className="absolute -top-10 flex items-center justify-center w-14 h-14 bg-[#1a1e3b] rounded-full shadow-lg border-4 border-purple-200">
                  <Icon className="text-white text-xl" />
                </div>
              )}

              {/* Normal Icon */}
              {!isActive && <Icon className="text-gray-400 text-lg mb-1" />}

              {/* Label */}
              <span
                className={`text-xs font-bold transition-all duration-300
                ${isActive ? "text-white mt-6" : "text-gray-400 mt-1"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;
