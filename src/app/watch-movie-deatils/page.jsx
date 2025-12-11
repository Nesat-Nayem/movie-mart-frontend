import { Suspense } from "react";
import FilmMartDetails from "./FilmMartDetails";

// ✅ Correct way to add Meta Title
export const metadata = {
  title: "Film Mart - Book & Explore Movies | MyApp",
  description:
    "Discover, explore and book the latest movies and film events at Film Mart.",
};

const WatchMovieDetailsPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <FilmMartDetails />
    </Suspense>
  );
};

export default WatchMovieDetailsPage;
