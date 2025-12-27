import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.youtube.com",
      "moviemart.vercel.app",
      "assets.img.com",
      "res.cloudinary.com",
      "www.filmofilia.com",
      "m.media-amazon.com",
      "image.tmdb.org",
      "assets-in.bmscdn.com",
      "lh3.googleusercontent.com", // Google profile images
      "googleusercontent.com",
      "i.ibb.co.com"
    ],
  },
  // Ensure .well-known files are served with correct headers
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
