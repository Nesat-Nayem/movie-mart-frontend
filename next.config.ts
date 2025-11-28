import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.youtube.com", // <-- add external host
      "ifmdb.vercel.app", // <-- add your API host if serving images
      "assets.img.com", // <-- any other external image host
      "res.cloudinary.com",
      "www.filmofilia.com",
      "m.media-amazon.com",
      "image.tmdb.org",
      "assets-in.bmscdn.com",
    ],
  },
};

export default nextConfig;
