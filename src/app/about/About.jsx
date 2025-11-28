import Link from "next/link";
import React from "react";
import {
  FaDownload,
  FaTicketAlt,
  FaEye,
  FaUsers,
  FaGlobe,
  FaCity,
  FaTv,
} from "react-icons/fa";
const About = () => {
  return (
    <>
      {/* breadcrumb */}
      <section
        className="relative bg-cover bg-center h-64 flex items-center"
        style={{
          backgroundImage: "url('/assets/img/about/1.avif')", // Replace with your banner image
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">About Us</h1>
          <nav className="text-sm">
            <ol className="list-reset flex text-gray-200">
              <li>
                <Link href="/" className="hover:text-red-400">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-red-400">About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* about start */}
      <div className="">
        {/* Top Stats Section */}
        <div className="max-w-6xl mx-auto px-4">
          <section className=" py-10">
            <div className="max-w-6xl mx-auto text-center space-y-6">
              <p className="text-sm md:text-base max-w-2xl mx-auto">
                25 years ago in South Africa a seed of an idea was planted, a
                dream was shared, Kingdom happened. 25 years on, we look back at
                what we built. Learn its legacies, and how old values do not age
                with time, but get stronger.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white/10 shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition transform">
                  <div className="flex justify-center mb-4">
                    <FaDownload className=" text-5xl" />
                  </div>
                  <h3 className="text-3xl font-bold">50 Million+</h3>
                  <p className=" mt-2">App Downloads</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white/10 shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition transform">
                  <div className="flex justify-center mb-4">
                    <FaTicketAlt className=" text-5xl" />
                  </div>
                  <h3 className="text-3xl font-bold ">15 Million+</h3>
                  <p className=" mt-2">Tickets a Month</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white/10 shadow-md rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition transform">
                  <div className="flex justify-center mb-4">
                    <FaEye className="text-5xl" />
                  </div>
                  <h3 className="text-3xl font-bold ">2 Billion+</h3>
                  <p className=" mt-2">Page Views a Month</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Quick Facts Section */}
        <section className="py-14 bg-white/10">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-xl font-semibold mb-10 relative inline-block">
              Quick Facts
              <span className="block w-12 h-1 bg-red-500 mx-auto mt-2"></span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {/* Customers */}
              <div className="bg-[#13162f] shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition transform">
                <div className="flex justify-center mb-4">
                  <FaUsers className="text-red-500 text-5xl" />
                </div>
                <h3 className="text-xl font-bold">30 Million+</h3>
                <p className="">Customers</p>
              </div>

              {/* Countries */}
              <div className="bg-[#13162f] shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition transform">
                <div className="flex justify-center mb-4">
                  <FaGlobe className="text-red-500 text-5xl" />
                </div>
                <h3 className="text-xl font-bold">5</h3>
                <p className="">Countries</p>
              </div>

              {/* Cities */}
              <div className="bg-[#13162f] shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition transform">
                <div className="flex justify-center mb-4">
                  <FaCity className="text-red-500 text-5xl" />
                </div>
                <h3 className="text-xl font-bold">650+</h3>
                <p className="">Towns and Cities</p>
              </div>

              {/* Screens */}
              <div className="bg-[#13162f] shadow-md rounded-2xl p-6 hover:shadow-xl hover:scale-105 transition transform">
                <div className="flex justify-center mb-4">
                  <FaTv className="text-red-500 text-5xl" />
                </div>
                <h3 className="text-xl font-bold">5000+</h3>
                <p className="">Screens</p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Timeline Section */}
        <div className="max-w-6xl mx-auto px-4">
          <section className="py-16">
            <div className="max-w-5xl mx-auto">
              {/* Heading */}
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-10 relative inline-block">
                  Our Journey
                  <span className="block w-12 h-1 bg-red-500 mx-auto mt-2"></span>
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-sm  text-center max-w-2xl mx-auto mb-12">
                25 years ago in South Africa a seed of an idea was planted, a
                dream was shared, Kingdom happened. 25 years on, we look back at
                what we built. Learn its legacies, and welcome its echo for the
                future.
              </p>

              {/* Timeline */}
              <div>
                <div className="relative border-l-2 border-red-500 pl-8">
                  {/* Timeline Item 1 */}
                  <div className="mb-12 relative">
                    {/* Year bubble */}
                    <div className="absolute text-xs -left-12 top-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      1999
                    </div>
                    {/* Content card */}
                    <div className="bg-white/10 shadow-md rounded-lg p-6">
                      <h3 className="font-semibold text-lg ">
                        The Three Musketeers
                      </h3>
                      <p className="text-sm  mt-2">
                        What happens when 3 legends of media get talking
                        together in South Africa? The seed of PVR idea is
                        planted. A company is founded, more heroes back them.
                        The trio Anil Ambani (CFO), Sanjeev K. Bijli (Executive
                        Director), and Co-Founder Ajay Bijli set the stage.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="mb-12 relative">
                    {/* Year bubble */}
                    <div className="absolute text-xs -left-12 top-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                      2000
                    </div>
                    {/* Content card */}
                    <div className="bg-white/10 shadow-md rounded-lg p-6">
                      <h3 className="font-semibold text-lg ">
                        Gaining Ground with Cinema
                      </h3>
                      <p className="text-sm  mt-2">
                        With the cinema industry in high and multiplexes gaining
                        momentum, PVR established its first few cinema screens,
                        setting the tone for innovation in India’s entertainment
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
