import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.youtube.com",
      "ifmdb.vercel.app",
      "assets.img.com",
      "res.cloudinary.com",
      "www.filmofilia.com",
      "m.media-amazon.com",
      "image.tmdb.org",
      "assets-in.bmscdn.com",
      "lh3.googleusercontent.com", // Google profile images
      "googleusercontent.com",
    ],
  },
};

export default nextConfig;
